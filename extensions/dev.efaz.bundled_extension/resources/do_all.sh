#!/bin/bash
script_dir=$(dirname "$(readlink -f "$0")")
python3 $script_dir/create_bundle.py
python3 $script_dir/create_firefox.py
python3 $script_dir/zip_mini_extensions.py