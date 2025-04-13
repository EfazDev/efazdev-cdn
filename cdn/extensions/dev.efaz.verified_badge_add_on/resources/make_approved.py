import os
import json
import time
import datetime
import typing

class pip:
    executable = None
    debug = False
    def __init__(self, command: list=[], executable: str=None, debug: bool=False):
        import sys
        import os
        import subprocess
        self.debug = debug==True
        if type(executable) is str:
            if os.path.isfile(executable):
                self.executable = executable
            else:
                self.executable = sys.executable
        else:
            self.executable = sys.executable
        if type(command) is list and len(command) > 0: subprocess.check_call([self.executable, "-m", "pip"] + command)
    def install(self, packages: typing.List[str]):
        import subprocess
        res = {}
        generated_list = []
        for i in packages:
            if type(i) is str: generated_list.append(i)
        if len(generated_list) > 0:
            try:
                subprocess.check_call([self.executable, "-m", "pip", "install"] + generated_list, stdout=self.debug == True and subprocess.PIPE or subprocess.DEVNULL, stderr=self.debug == True and subprocess.PIPE or subprocess.DEVNULL)
                return {"success": True}
            except Exception as e:
                return {"success": False}
        return res
    def uninstall(self, packages: typing.List[str]):
        import subprocess
        res = {}
        generated_list = []
        for i in packages:
            if type(i) is str:
                generated_list.append(i)
        if len(generated_list) > 0:
            try:
                subprocess.check_call([self.executable, "-m", "pip", "uninstall"] + generated_list, stdout=self.debug == True and subprocess.PIPE or subprocess.DEVNULL, stderr=self.debug == True and subprocess.PIPE or subprocess.DEVNULL)
                res[i] = {"success": True}
            except Exception as e:
                res[i] = {"success": False}
        return res
    def installed(self, packages: typing.List[str]=[], boolonly: bool=False):
        import subprocess
        sub = subprocess.run([self.executable, "-m", "pip", "list"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        line_splits = sub.stdout.decode().splitlines()[2:]
        installed_packages = [package.split()[0] for package in line_splits if package.strip()]
        installed_checked = {}
        all_installed = True
        if len(packages) == 0:
            return installed_packages
        elif len(packages) == 1:
            return packages[0] in installed_packages
        else:
            for i in packages:
                try:
                    if i in installed_packages:
                        installed_checked[i] = True
                    else:
                        installed_checked[i] = False
                        all_installed = False
                except Exception as e:
                    installed_checked[i] = False
                    all_installed = False
            installed_checked["all"] = all_installed
            if boolonly == True: return installed_checked["all"]
            return installed_checked
    def getLatestPythonVersion(self, beta: bool=False):
        import urllib.request
        import re
        import gzip
        import io
        import ssl
        url = "https://www.python.org/downloads/"
        if beta == True: url = "https://www.python.org/download/pre-releases/"
        unsecure_context = None
        if not self.pythonSupported(3, 9, 0): unsecure_context = ssl._create_unverified_context()
        with urllib.request.urlopen(url, context=unsecure_context) as response:
            if response.headers.get('Content-Encoding') == 'gzip':
                buf = io.BytesIO(response.read())
                f = gzip.GzipFile(fileobj=buf)
                html = f.read().decode('utf-8')
            else:
                html = response.read().decode('utf-8')
        if beta == True: match = re.search(r'Python (\d+\.\d+\.\d+)([a-zA-Z0-9]+)?', html)
        else: match = re.search(r"Download Python (\d+\.\d+\.\d+)", html)
        if match:
            if beta == True: version = f'{match.group(1)}{match.group(2)}'
            else: version = match.group(1)
            return version
        else:
            if self.debug == True: print("Failed to find latest Python version.")
            return None
    def getCurrentPythonVersion(self):
        import subprocess
        if not self.executable: return None
        if self.isSameRunningPythonExecutable():
            import platform
            return platform.python_version()
        else:
            a = subprocess.run([self.executable, "-V"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            final = a.stdout.decode()
            if a.returncode == 0: return final.replace("Python ", "").replace("\n", "")
            else: return None
    def getIfPythonVersionIsBeta(self, version=""):
        import re
        if version == "": cur_vers = self.getCurrentPythonVersion()
        else: cur_vers = version
        match = re.search(r'(\d+\.\d+\.\d+)([a-z]+(\d+)?)?', cur_vers)
        if match:
            _, suf, _ = match.groups()
            if suf: return True
            return False
        else:
            return False
    def getIfPythonIsLatest(self):
        cur_vers = self.getCurrentPythonVersion()
        if self.getIfPythonVersionIsBeta(): latest_vers = self.getLatestPythonVersion(beta=True)
        else: latest_vers = self.getLatestPythonVersion(beta=False)
        return cur_vers == latest_vers
    def pythonInstalled(self):
        import os
        if not self.executable: return False
        if os.path.exists(self.executable): return True
        else: return False
    def pythonSupported(self, major: int=3, minor: int=13, patch: int=2):
        import re
        cur_version = self.getCurrentPythonVersion()
        if not cur_version: return False
        match = re.match(r"(\d+)\.(\d+)\.(\w+)", cur_version)
        if match:
            cur_version = match.groups() 
            def to_int(val): return int(re.sub(r'\D', '', val))
            return tuple(map(to_int, cur_version)) >= (major, minor, patch)
        else: return False
    def pythonInstall(self, version: str="", beta: bool=False):
        import subprocess
        import platform
        import tempfile
        import time
        import re
        ma_os = platform.system()
        ma_arch = platform.architecture()
        ma_processor = platform.machine()
        if version == "": version = self.getLatestPythonVersion(beta=beta)
        if not version:
            if self.debug == True: print("Failed to download Python installer.")
            return
        version_url_folder = version
        if beta == True: version_url_folder = re.match(r'^\d+\.\d+\.\d+', version).group()
        if ma_os == "Darwin":
            url = f"https://www.python.org/ftp/python/{version_url_folder}/python-{version}-macos11.pkg"
            with tempfile.NamedTemporaryFile(suffix=".pkg", delete=False) as temp_file: pkg_file_path = temp_file.name
            result = subprocess.run(["curl", "-o", pkg_file_path, url], stdout=self.debug == True and subprocess.PIPE or subprocess.DEVNULL, stderr=self.debug == True and subprocess.PIPE or subprocess.DEVNULL)            
            if result.returncode == 0:
                subprocess.run(["open", pkg_file_path], stdout=self.debug == True and subprocess.PIPE or subprocess.DEVNULL, stderr=self.debug == True and subprocess.PIPE or subprocess.DEVNULL, check=True)
                while self.getIfProcessIsOpened("Installer") == True:
                    time.sleep(0.1)
                if self.debug == True: print(f"Python installer has been executed: {pkg_file_path}")
            else:
                if self.debug == True: print("Failed to download Python installer.")
        elif ma_os == "Windows":
            if ma_arch[0] == "64bit":
                if ma_processor.lower() == "arm64": url = f"https://www.python.org/ftp/python/{version_url_folder}/python-{version}-arm64.exe"
                else: url = f"https://www.python.org/ftp/python/{version_url_folder}/python-{version}-amd64.exe"
            else:
                url = f"https://www.python.org/ftp/python/{version_url_folder}/python-{version}.exe"
            with tempfile.NamedTemporaryFile(suffix=".exe", delete=False) as temp_file: exe_file_path = temp_file.name
            result = subprocess.run(["curl", "-o", exe_file_path, url], stdout=self.debug == True and subprocess.PIPE or subprocess.DEVNULL, stderr=self.debug == True and subprocess.PIPE or subprocess.DEVNULL)            
            if result.returncode == 0:
                subprocess.run([exe_file_path], stdout=self.debug == True and subprocess.PIPE or subprocess.DEVNULL, stderr=self.debug == True and subprocess.PIPE or subprocess.DEVNULL, check=True)
                if self.debug == True: print(f"Python installer has been executed: {exe_file_path}")
            else:
                if self.debug == True: print("Failed to download Python installer.")
    def getLocalAppData(self):
        import platform
        import os
        ma_os = platform.system()
        if ma_os == "Windows": return os.path.expandvars(r'%LOCALAPPDATA%')
        elif ma_os == "Darwin": return f'{os.path.expanduser("~")}/Library/'
        else: return f'{os.path.expanduser("~")}/'
    def restartScript(self, scriptname: str, argv: list):
        import sys
        import subprocess
        import os
        subprocess.run(f'{self.executable} {os.path.join(os.path.dirname(os.path.abspath(__file__)), scriptname)} {" ".join(argv)}', shell=True)
        sys.exit(0)
    def importModule(self, module_name: str, install_module_if_not_found: bool=False):
        import importlib
        try:
            return importlib.import_module(module_name)
        except ModuleNotFoundError:
            try:
                if install_module_if_not_found == True and self.isSameRunningPythonExecutable(): self.install([module_name])
                return importlib.import_module(module_name)
            except Exception as e:
                raise ImportError(f'Unable to find module "{module_name}" in Python {self.getCurrentPythonVersion()} environment.')
    def copyTreeWithMetadata(self, src: str, dst: str, symlinks=False, ignore=None, dirs_exist_ok=False, ignore_if_not_exist=False):
        import shutil
        import os
        import stat
        if not os.path.exists(src) and ignore_if_not_exist == False: return
        if not dirs_exist_ok and os.path.exists(dst): raise FileExistsError(f"Destination '{dst}' already exists.")
        os.makedirs(dst, exist_ok=True)
        for root, dirs, files in os.walk(src):
            rel_path = os.path.relpath(root, src)
            dst_root = os.path.join(dst, rel_path)
            ignored_names = ignore(root, os.listdir(root)) if ignore else set()
            dirs[:] = [d for d in dirs if d not in ignored_names]
            files = [f for f in files if f not in ignored_names]
            os.makedirs(dst_root, exist_ok=True)
            for dir_name in dirs:
                src_dir = os.path.join(root, dir_name)
                dst_dir = os.path.join(dst_root, dir_name)

                if os.path.islink(src_dir) and symlinks:
                    link_target = os.readlink(src_dir)
                    os.symlink(link_target, dst_dir)
                else:
                    os.makedirs(dst_dir, exist_ok=True)
                    shutil.copystat(src_dir, dst_dir, follow_symlinks=False)
                    os.chmod(dst_dir, os.stat(dst_dir).st_mode | stat.S_IWGRP | stat.S_IROTH | stat.S_IWOTH)
            for file_name in files:
                src_file = os.path.join(root, file_name)
                dst_file = os.path.join(dst_root, file_name)
                if os.path.islink(src_file) and symlinks:
                    link_target = os.readlink(src_file)
                    os.symlink(link_target, dst_file)
                else:
                    shutil.copy2(src_file, dst_file)
                    os.chmod(dst_file, os.stat(dst_file).st_mode | stat.S_IWGRP | stat.S_IROTH | stat.S_IWOTH)
            shutil.copystat(root, dst_root, follow_symlinks=False)
            os.chmod(dst_root, os.stat(dst_root).st_mode | stat.S_IWGRP | stat.S_IROTH | stat.S_IWOTH)
        return dst
    def getIfProcessIsOpened(self, process_name="", pid=""):
        import platform
        import subprocess
        ma_os = platform.system()
        if ma_os == "Windows":
            process = subprocess.Popen(["tasklist"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            output, _ = process.communicate()
            process_list = output.decode("utf-8")

            if pid == "" or pid == None:
                if process_list.rfind(process_name) == -1:
                    return False
                else:
                    return True
            else:
                if process_list.rfind(pid) == -1:
                    return False
                else:
                    return True
        else:
            if pid == "" or pid == None:
                if subprocess.run(f"pgrep -f '{process_name}' > /dev/null 2>&1", shell=True).returncode == 0:
                    return True
                else:
                    return False
            else:
                if subprocess.run(f"ps -p {pid} > /dev/null 2>&1", shell=True).returncode == 0:
                    return True
                else:
                    return False
    def getAmountOfProcesses(self, process_name=""):
        import platform
        import subprocess
        ma_os = platform.system()
        if ma_os == "Windows":
            process = subprocess.Popen(["tasklist"], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            output, _ = process.communicate()
            process_list = output.decode("utf-8")
            return process_list.lower().count(process_name.lower())
        else:
            result = subprocess.run(f"pgrep -f '{process_name}'", stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
            process_ids = result.stdout.decode("utf-8").strip().split("\n")
            return len([pid for pid in process_ids if pid.isdigit()])
    def getIfConnectedToInternet(self):
        import socket
        try:
            socket.create_connection(("8.8.8.8", 443), timeout=3)
            return True
        except Exception as e:
            return False
    def is32BitWindows(self): 
        import subprocess
        if not self.executable: return False
        if self.isSameRunningPythonExecutable():
            import platform
            return platform.system() == "Windows" and platform.architecture()[0] == "32bit"
        else:
            a = subprocess.run([self.executable, "-c", 'import platform; print(platform.system() == "Windows" and platform.architecture()[0] == "32bit")'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            final = a.stdout.decode()
            return final.replace("\n", "") == "True"
    def isOppositeArchitecture(self):
        import platform
        import os
        ma_os = platform.system()
        ma_arch = platform.machine()
        if not self.executable: return False
        if ma_os == "Windows" and os.path.dirname(self.executable).endswith("-32"): return True
        elif ma_os == "Darwin" and ma_arch.lower() == "arm64" and self.executable.endswith("-intel64"): return True
        return False
    def isSameRunningPythonExecutable(self):
        import os
        import sys
        return os.path.samefile(self.executable, sys.executable)
    def getProcessWindows(self, pid: int):
        import platform
        if (type(pid) is str and pid.isnumeric()) or type(pid) is int:
            if platform.system() == "Windows":
                try:
                    import win32gui # type: ignore
                    import win32process # type: ignore
                except Exception as e:
                    self.install(["pywin32"])
                    win32gui = self.importModule("win32gui")
                    win32process = self.importModule("win32process")
                system_windows = []
                def callback(hwnd, _):
                    if win32gui.IsWindowVisible(hwnd):
                        _, window_pid = win32process.GetWindowThreadProcessId(hwnd)
                        if window_pid == int(pid):
                            system_windows.append(hwnd)
                win32gui.EnumWindows(callback, None)
                return system_windows
            elif platform.system() == "Darwin":
                try:
                    from Quartz import CGWindowListCopyWindowInfo, kCGWindowListOptionOnScreenOnly
                except Exception as e:
                    self.install(["pyobjc-framework-Quartz"])
                    Quartz = self.importModule("Quartz")
                    CGWindowListCopyWindowInfo, kCGWindowListOptionOnScreenOnly = Quartz.CGWindowListCopyWindowInfo, Quartz.kCGWindowListOptionOnScreenOnly
                system_windows = CGWindowListCopyWindowInfo(kCGWindowListOptionOnScreenOnly, 0)
                app_windows = [win for win in system_windows if win.get("kCGWindowOwnerPID") == int(pid)]
                new_set_of_system_windows = []
                for win in app_windows:
                    if win and win.get("kCGWindowOwnerPID"):
                        new_set_of_system_windows.append(win)
                return new_set_of_system_windows
            else:
                return []
        else:
            return []
    def findPython(self, opposite_arch=False, latest=True):
        import os
        import glob
        import platform
        ma_os = platform.system()
        ma_arch = platform.machine()
        if ma_os == "Darwin":
            target_name = "python3"
            if opposite_arch == True and ma_arch == "arm64": target_name = "python3-intel64"
            if os.path.exists(f"/usr/local/bin/{target_name}") and os.path.islink(f"/usr/local/bin/{target_name}"):
                return f"/usr/local/bin/{target_name}"
            else:
                paths = [
                    "/usr/local/bin/python*",
                    "/Library/Frameworks/Python.framework/Versions/*/bin/python*",
                    os.path.expanduser("~/Library/Python/*/bin/python*")
                ]
                found_paths = []
                for path_pattern in paths:
                    found_paths.extend(glob.glob(path_pattern))
                found_paths = sorted(found_paths, reverse=True, key=lambda x: x.split("/")[-2] if "Versions" in x else x)
                for path in found_paths:
                    if os.path.isfile(path):
                        if not (opposite_arch == True) and not (ma_arch.lower() == "arm64" and "intel64" in path): return path
                        elif opposite_arch == True and ma_arch.lower() == "arm64" and "intel64" in path: return path
                return None
        elif ma_os == "Windows":
            paths = [
                os.path.expandvars(r'%LOCALAPPDATA%\\Programs\\Python\\Python*'),
                os.path.expandvars(r'%LOCALAPPDATA%\\Programs\\Python\\Python*\\python.exe'),
                os.path.expandvars(r'%PROGRAMFILES%\\Python*\\python.exe'),
                os.path.expandvars(r'%PROGRAMFILES(x86)%\\Python*\\python.exe')
            ]

            found_paths = []
            for path_pattern in paths:
                found_paths.extend(glob.glob(path_pattern))
            found_paths = sorted(found_paths, reverse=True, key=lambda x: x if x.endswith("python.exe") else x + "\\python.exe")
            for path in found_paths:
                if os.path.isfile(path):
                    if opposite_arch == True and "-32" not in os.path.dirname(path): continue
                    return path
            return None
    def findPythons(self, opposite_arch=False):
        import os
        import glob
        import platform
        ma_os = platform.system()
        ma_arch = platform.machine()
        founded_pythons = []
        if ma_os == "Darwin":
            paths = [
                "/usr/local/bin/python*",
                "/Library/Frameworks/Python.framework/Versions/*/bin/python*",
                "~/Library/Python/*/bin/python*"
            ]
            for path_pattern in paths:
                for path in glob.glob(path_pattern):
                    if os.path.isfile(path):
                        if not (opposite_arch == True) and not (ma_arch.lower() == "arm64" and "intel64" in path): 
                            if path.endswith("t") or path.endswith("config") or path.endswith("m") or os.path.basename(path).startswith("pythonw"): continue
                            pip_class_for_py = pip(executable=path)
                            founded_pythons.append(pip_class_for_py)
                            print(path)
                        elif ma_arch.lower() == "arm64" and "intel64" in path and opposite_arch == True:
                            if path.endswith("t") or path.endswith("config") or path.endswith("m") or os.path.basename(path).startswith("pythonw"): continue
                            pip_class_for_py = pip(executable=path)
                            founded_pythons.append(pip_class_for_py)
                            print(path)
        elif ma_os == "Windows":
            paths = [
                os.path.expandvars(r'%LOCALAPPDATA%\\Programs\\Python\\Python*'),
                os.path.expandvars(r'%LOCALAPPDATA%\\Programs\\Python\\Python*\\python.exe'),
                os.path.expandvars(r'%PROGRAMFILES%\\Python*\\python.exe'),
                os.path.expandvars(r'%PROGRAMFILES(x86)%\\Python*\\python.exe')
            ]
            for path_pattern in paths:
                for path in glob.glob(path_pattern):
                    if os.path.isfile(path):
                        if opposite_arch == True and not (os.path.dirname(path).endswith("-32")): continue
                        pip_class_for_py = pip(executable=path)
                        founded_pythons.append(pip_class_for_py)
        return founded_pythons
def printMainMessage(mes): print(f"\033[38;5;255m{mes}\033[0m")
def printErrorMessage(mes): print(f"\033[38;5;196m{mes}\033[0m")
def printSuccessMessage(mes): print(f"\033[38;5;82m{mes}\033[0m")
def printWarnMessage(mes): print(f"\033[38;5;202m{mes}\033[0m")
def printDebugMessage(mes): print(f"\033[38;5;226m{mes}\033[0m")
current_path_location = os.path.dirname(os.path.abspath(__file__))
pip_class = pip()
requests = pip_class.importModule("requests", install_module_if_not_found=True)

printWarnMessage("-----------")
printWarnMessage("Approved Users Builder")
printWarnMessage("Made by @EfazDev")
printWarnMessage("v1.0.0")
printWarnMessage("------------------------------")

printMainMessage("Welcome to the Approved Users Builder!")
printMainMessage("Please select what option you would like to choose by typing the number and clicking enter.")
printMainMessage("[1] = Make JSON")
printMainMessage("[*] = Exit Builder")
val = input("> ")
if val == "1":
    generated = {}
    generated_filtered_json = {}
    printMainMessage("Alright! You would like to make a JSON. Start by manually pasting User IDs one by one.")
    printMainMessage("For example, typing 500 would represent the ID 500.")
    printMainMessage("When you're done, type \"exit\" and continue.")
    while True:
        i = input("> ")
        if i.isnumeric():
            printWarnMessage(f"--- User ID: {i} ---")
            try:
                start_time = datetime.datetime.now(datetime.UTC).timestamp()
                def user_data_scan():
                    res = requests.get(f"https://users.roblox.com/v1/users/{str(i)}")
                    if res.ok:
                        jso = res.json()
                        if jso.get("name"):
                            return jso
                        else:
                            time.sleep(1)
                            return user_data_scan()
                    else:
                        time.sleep(1)
                        return user_data_scan()
                def scan():
                    res = requests.get(f"https://groups.roblox.com/v1/users/{str(i)}/groups/roles?includeLocked=true&includeNotificationPreferences=true")
                    if res.ok:
                        jso = res.json()
                        if jso.get("data"):
                            return jso["data"]
                        else:
                            print(f"Something went wrong scanning groups for this user! Returning blank: {jso}")
                            return []
                    else:
                        if res.status_code == 429:
                            time.sleep(1)
                            return scan()
                        else:
                            print(f"Something went wrong scanning groups for this user! Returning blank: {res.status_code}")
                            return []
                res = scan()
                user_data = user_data_scan()
                generated[str(i)] = []
                generated_filtered_json[i] = {}
                owned_group_names = []
                for r in res:
                    if r.get("group"):
                        if r["group"].get("owner"):
                            if str(r["group"]["owner"].get("userId")) == i:
                                generated[str(i)].append(r["group"])
                                owned_group_names.append(r["group"]["name"])
                generated_filtered_json[i]["name"] = user_data["name"]
                generated_filtered_json[i]["id"] = user_data["id"]
                generated_filtered_json[i]["displayName"] = user_data["displayName"]
                generated_filtered_json[i]["hexColor"] = "#0066ff"
                generated_filtered_json[i]["approve_groups"] = generated[str(i)]
                generated_filtered_json[i]["scan_timestamp"] = int(datetime.datetime.now(datetime.UTC).timestamp())
                generated_filtered_json[i]["scan_duration"] = round(datetime.datetime.now(datetime.UTC).timestamp() - start_time, 2)
                printMainMessage(f"Name: {generated_filtered_json[i]['displayName']} [@{generated_filtered_json[i]['name']}]")
                printMainMessage(f"User ID: {generated_filtered_json[i]['id']}")
                printMainMessage(f"Groups: {', '.join(owned_group_names)}")
                printMainMessage(f"Color: {generated_filtered_json[i]['hexColor']}")
                printMainMessage(f"Scan Duration: {generated_filtered_json[i]['scan_duration']}s")
            except Exception as e:
                printErrorMessage(f"Unable to scan ID: {i} | Error: {str(e)}")
        elif i == "exit":
            printWarnMessage("--- Preparing Save ---")
            printMainMessage("Saving your generated JSON file now!")
            with open(os.path.join(current_path_location, "generated_users.json"), "w") as f:
                json.dump(generated_filtered_json, f, indent=4)
            printSuccessMessage(f'Saved successfully to file! File path: {os.path.join(current_path_location, "generated_users.json")}')
            break
        else:
            printDebugMessage("This ID is not an number!")
else:
    exit()