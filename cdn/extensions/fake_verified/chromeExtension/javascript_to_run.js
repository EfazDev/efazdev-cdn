window.onload = function () {
    setTimeout(function () {
        var enabled = true;
        var allow_messages = true;

        if (window.verifiedCheckmarkSettings) {
            if (window.verifiedCheckmarkSettings["allowedAlerts"] == false) {
                allow_messages = false;
            }
        }

        if (enabled) {
            var profile_html = atob("PHNwYW4gcm9sZT0iYnV0dG9uIiB0YWJpbmRleD0iMCIgZGF0YS1yYmx4LXZlcmlmaWVkLWJhZGdlLWljb249IiIgZGF0YS1yYmx4LWJhZGdlLWljb249InRydWUiIGNsYXNzPSJqc3MxNiI+PGltZyBjbGFzcz0icHJvZmlsZS12ZXJpZmllZC1iYWRnZS1pY29uIiBzcmM9ImRhdGE6aW1hZ2Uvc3ZnK3htbDtjaGFyc2V0PXV0Zi04LCUzQ3N2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScyOCcgaGVpZ2h0PScyOCcgdmlld0JveD0nMCAwIDI4IDI4JyBmaWxsPSdub25lJyUzRSUzQ2cgY2xpcC1wYXRoPSd1cmwoJTIzY2xpcDBfOF80NiknJTNFJTNDcmVjdCB4PSc1Ljg4ODE4JyB3aWR0aD0nMjIuODknIGhlaWdodD0nMjIuODknIHRyYW5zZm9ybT0ncm90YXRlKDE1IDUuODg4MTggMCknIGZpbGw9JyUyMzAwNjZGRicvJTNFJTNDcGF0aCBmaWxsLXJ1bGU9J2V2ZW5vZGQnIGNsaXAtcnVsZT0nZXZlbm9kZCcgZD0nTTIwLjU0MyA4Ljc1MDhMMjAuNTQ5IDguNzU2OEMyMS4xNSA5LjM1NzggMjEuMTUgMTAuMzMxOCAyMC41NDkgMTAuOTMyOEwxMS44MTcgMTkuNjY0OEw3LjQ1IDE1LjI5NjhDNi44NSAxNC42OTU4IDYuODUgMTMuNzIxOCA3LjQ1IDEzLjEyMThMNy40NTcgMTMuMTE0OEM4LjA1OCAxMi41MTM4IDkuMDMxIDEyLjUxMzggOS42MzMgMTMuMTE0OEwxMS44MTcgMTUuMjk5OEwxOC4zNjcgOC43NTA4QzE4Ljk2OCA4LjE0OTggMTkuOTQyIDguMTQ5OCAyMC41NDMgOC43NTA4WicgZmlsbD0nd2hpdGUnLyUzRSUzQy9nJTNFJTNDZGVmcyUzRSUzQ2NsaXBQYXRoIGlkPSdjbGlwMF84XzQ2JyUzRSUzQ3JlY3Qgd2lkdGg9JzI4JyBoZWlnaHQ9JzI4JyBmaWxsPSd3aGl0ZScvJTNFJTNDL2NsaXBQYXRoJTNFJTNDL2RlZnMlM0UlM0Mvc3ZnJTNFIiB0aXRsZT0iW2lucHV0X2lkXSIgYWx0PSJbaW5wdXRfaWRdIj48L3NwYW4+");
            var name_html = atob("PGltZyBjbGFzcz0idmVyaWZpZWQtYmFkZ2UtaWNvbi1jYXRhbG9nLWl0ZW0tcmVuZGVyZWQiIHNyYz0iZGF0YTppbWFnZS9zdmcreG1sO2NoYXJzZXQ9dXRmLTgsJTNDc3ZnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zycgd2lkdGg9JzI4JyBoZWlnaHQ9JzI4JyB2aWV3Qm94PScwIDAgMjggMjgnIGZpbGw9J25vbmUnJTNFJTNDZyBjbGlwLXBhdGg9J3VybCglMjNjbGlwMF84XzQ2KSclM0UlM0NyZWN0IHg9JzUuODg4MTgnIHdpZHRoPScyMi44OScgaGVpZ2h0PScyMi44OScgdHJhbnNmb3JtPSdyb3RhdGUoMTUgNS44ODgxOCAwKScgZmlsbD0nJTIzMDA2NkZGJy8lM0UlM0NwYXRoIGZpbGwtcnVsZT0nZXZlbm9kZCcgY2xpcC1ydWxlPSdldmVub2RkJyBkPSdNMjAuNTQzIDguNzUwOEwyMC41NDkgOC43NTY4QzIxLjE1IDkuMzU3OCAyMS4xNSAxMC4zMzE4IDIwLjU0OSAxMC45MzI4TDExLjgxNyAxOS42NjQ4TDcuNDUgMTUuMjk2OEM2Ljg1IDE0LjY5NTggNi44NSAxMy43MjE4IDcuNDUgMTMuMTIxOEw3LjQ1NyAxMy4xMTQ4QzguMDU4IDEyLjUxMzggOS4wMzEgMTIuNTEzOCA5LjYzMyAxMy4xMTQ4TDExLjgxNyAxNS4yOTk4TDE4LjM2NyA4Ljc1MDhDMTguOTY4IDguMTQ5OCAxOS45NDIgOC4xNDk4IDIwLjU0MyA4Ljc1MDhaJyBmaWxsPSd3aGl0ZScvJTNFJTNDL2clM0UlM0NkZWZzJTNFJTNDY2xpcFBhdGggaWQ9J2NsaXAwXzhfNDYnJTNFJTNDcmVjdCB3aWR0aD0nMjgnIGhlaWdodD0nMjgnIGZpbGw9J3doaXRlJy8lM0UlM0MvY2xpcFBhdGglM0UlM0MvZGVmcyUzRSUzQy9zdmclM0UiIHRpdGxlPSJWZXJpZmllZCBCYWRnZSBJY29uIiBhbHQ9IlZlcmlmaWVkIEJhZGdlIEljb24iPg==");
            var name_html_larger = atob("PHNwYW4gcm9sZT0iYnV0dG9uIiB0YWJpbmRleD0iMCIgc2VjdXJlZC1hcHBsZXMtdmVyaWZpZWQtYmFkZ2UtYnV0dG9uPSJ5ZXNzc3MiIGRhdGEtcmJseC12ZXJpZmllZC1iYWRnZS1pY29uPSIiIGRhdGEtcmJseC1iYWRnZS1pY29uPSJ0cnVlIiBjbGFzcz0ianNzMjkyIj48aW1nIGNsYXNzPSJ2ZXJpZmllZC1iYWRnZS1pY29uLWdyb3VwLXNob3V0LXJlbmRlcmVkIiBzcmM9ImRhdGE6aW1hZ2Uvc3ZnK3htbDtjaGFyc2V0PXV0Zi04LCUzQ3N2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScyOCcgaGVpZ2h0PScyOCcgdmlld0JveD0nMCAwIDI4IDI4JyBmaWxsPSdub25lJyUzRSUzQ2cgY2xpcC1wYXRoPSd1cmwoJTIzY2xpcDBfOF80NiknJTNFJTNDcmVjdCB4PSc1Ljg4ODE4JyB3aWR0aD0nMjIuODknIGhlaWdodD0nMjIuODknIHRyYW5zZm9ybT0ncm90YXRlKDE1IDUuODg4MTggMCknIGZpbGw9JyUyMzAwNjZGRicvJTNFJTNDcGF0aCBmaWxsLXJ1bGU9J2V2ZW5vZGQnIGNsaXAtcnVsZT0nZXZlbm9kZCcgZD0nTTIwLjU0MyA4Ljc1MDhMMjAuNTQ5IDguNzU2OEMyMS4xNSA5LjM1NzggMjEuMTUgMTAuMzMxOCAyMC41NDkgMTAuOTMyOEwxMS44MTcgMTkuNjY0OEw3LjQ1IDE1LjI5NjhDNi44NSAxNC42OTU4IDYuODUgMTMuNzIxOCA3LjQ1IDEzLjEyMThMNy40NTcgMTMuMTE0OEM4LjA1OCAxMi41MTM4IDkuMDMxIDEyLjUxMzggOS42MzMgMTMuMTE0OEwxMS44MTcgMTUuMjk5OEwxOC4zNjcgOC43NTA4QzE4Ljk2OCA4LjE0OTggMTkuOTQyIDguMTQ5OCAyMC41NDMgOC43NTA4WicgZmlsbD0nd2hpdGUnLyUzRSUzQy9nJTNFJTNDZGVmcyUzRSUzQ2NsaXBQYXRoIGlkPSdjbGlwMF84XzQ2JyUzRSUzQ3JlY3Qgd2lkdGg9JzI4JyBoZWlnaHQ9JzI4JyBmaWxsPSd3aGl0ZScvJTNFJTNDL2NsaXBQYXRoJTNFJTNDL2RlZnMlM0UlM0Mvc3ZnJTNFIiB0aXRsZT0iVmVyaWZpZWQgQmFkZ2UgSWNvbiIgYWx0PSJWZXJpZmllZCBCYWRnZSBJY29uIj48L3NwYW4+");
            var name_side_html = atob("PGltZyBzcmM9ImRhdGE6aW1hZ2Uvc3ZnK3htbDtjaGFyc2V0PXV0Zi04LCUzQ3N2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScyOCcgaGVpZ2h0PScyOCcgdmlld0JveD0nMCAwIDI4IDI4JyBmaWxsPSdub25lJyUzRSUzQ2cgY2xpcC1wYXRoPSd1cmwoJTIzY2xpcDBfOF80NiknJTNFJTNDcmVjdCB4PSc1Ljg4ODE4JyB3aWR0aD0nMjIuODknIGhlaWdodD0nMjIuODknIHRyYW5zZm9ybT0ncm90YXRlKDE1IDUuODg4MTggMCknIGZpbGw9JyUyMzAwNjZGRicvJTNFJTNDcGF0aCBmaWxsLXJ1bGU9J2V2ZW5vZGQnIGNsaXAtcnVsZT0nZXZlbm9kZCcgZD0nTTIwLjU0MyA4Ljc1MDhMMjAuNTQ5IDguNzU2OEMyMS4xNSA5LjM1NzggMjEuMTUgMTAuMzMxOCAyMC41NDkgMTAuOTMyOEwxMS44MTcgMTkuNjY0OEw3LjQ1IDE1LjI5NjhDNi44NSAxNC42OTU4IDYuODUgMTMuNzIxOCA3LjQ1IDEzLjEyMThMNy40NTcgMTMuMTE0OEM4LjA1OCAxMi41MTM4IDkuMDMxIDEyLjUxMzggOS42MzMgMTMuMTE0OEwxMS44MTcgMTUuMjk5OEwxOC4zNjcgOC43NTA4QzE4Ljk2OCA4LjE0OTggMTkuOTQyIDguMTQ5OCAyMC41NDMgOC43NTA4WicgZmlsbD0nd2hpdGUnLyUzRSUzQy9nJTNFJTNDZGVmcyUzRSUzQ2NsaXBQYXRoIGlkPSdjbGlwMF84XzQ2JyUzRSUzQ3JlY3Qgd2lkdGg9JzI4JyBoZWlnaHQ9JzI4JyBmaWxsPSd3aGl0ZScvJTNFJTNDL2NsaXBQYXRoJTNFJTNDL2RlZnMlM0UlM0Mvc3ZnJTNFIiB0aXRsZT0iVmVyaWZpZWQgQmFkZ2UgSWNvbiIgYWx0PSJWZXJpZmllZCBCYWRnZSBJY29uIiBzdHlsZT0ibWFyZ2luLWxlZnQ6IDJweDt3aWR0aDogMTJweDtoZWlnaHQ6IDEycHg7IGJhY2tncm91bmQ6IG5vbmUgIWltcG9ydGFudDsiPg==");
            var name_side_real_html = atob("PGltZyBzcmM9ImRhdGE6aW1hZ2Uvc3ZnK3htbDtjaGFyc2V0PXV0Zi04LCUzQ3N2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScyOCcgaGVpZ2h0PScyOCcgdmlld0JveD0nMCAwIDI4IDI4JyBmaWxsPSdub25lJyUzRSUzQ2cgY2xpcC1wYXRoPSd1cmwoJTIzY2xpcDBfOF80NiknJTNFJTNDcmVjdCB4PSc1Ljg4ODE4JyB3aWR0aD0nMjIuODknIGhlaWdodD0nMjIuODknIHRyYW5zZm9ybT0ncm90YXRlKDE1IDUuODg4MTggMCknIGZpbGw9JyUyMzAwNjZGRicvJTNFJTNDcGF0aCBmaWxsLXJ1bGU9J2V2ZW5vZGQnIGNsaXAtcnVsZT0nZXZlbm9kZCcgZD0nTTIwLjU0MyA4Ljc1MDhMMjAuNTQ5IDguNzU2OEMyMS4xNSA5LjM1NzggMjEuMTUgMTAuMzMxOCAyMC41NDkgMTAuOTMyOEwxMS44MTcgMTkuNjY0OEw3LjQ1IDE1LjI5NjhDNi44NSAxNC42OTU4IDYuODUgMTMuNzIxOCA3LjQ1IDEzLjEyMThMNy40NTcgMTMuMTE0OEM4LjA1OCAxMi41MTM4IDkuMDMxIDEyLjUxMzggOS42MzMgMTMuMTE0OEwxMS44MTcgMTUuMjk5OEwxOC4zNjcgOC43NTA4QzE4Ljk2OCA4LjE0OTggMTkuOTQyIDguMTQ5OCAyMC41NDMgOC43NTA4WicgZmlsbD0nd2hpdGUnLyUzRSUzQy9nJTNFJTNDZGVmcyUzRSUzQ2NsaXBQYXRoIGlkPSdjbGlwMF84XzQ2JyUzRSUzQ3JlY3Qgd2lkdGg9JzI4JyBoZWlnaHQ9JzI4JyBmaWxsPSd3aGl0ZScvJTNFJTNDL2NsaXBQYXRoJTNFJTNDL2RlZnMlM0UlM0Mvc3ZnJTNFIiB0aXRsZT0iVmVyaWZpZWQgQmFkZ2UgSWNvbiIgYWx0PSJWZXJpZmllZCBCYWRnZSBJY29uIiBzdHlsZT0ibWFyZ2luLWxlZnQ6IDJweDt3aWR0aDogMThweDtoZWlnaHQ6IDE4cHg7IGJhY2tncm91bmQ6IG5vbmUgIWltcG9ydGFudDsiPg==");
            var prompt_html = atob("PGRpdiByb2xlPSJkaWFsb2ciIGlkPSJmYWtlX3ZlcmlmaWVkX2JhZGdlIj48ZGl2IGNsYXNzPSJtb2RhbC1iYWNrZHJvcCBpbiI+PC9kaXY+PGRpdiByb2xlPSJkaWFsb2ciIHRhYmluZGV4PSItMSIgY2xhc3M9ImluIG1vZGFsIiBzdHlsZT0iZGlzcGxheTogYmxvY2s7Ij48ZGl2IGNsYXNzPSJtb2RhbC13aW5kb3cgbW9kYWwtc20gbW9kYWwtZGlhbG9nIj48ZGl2IGNsYXNzPSJtb2RhbC1jb250ZW50IiByb2xlPSJkb2N1bWVudCI+PGRpdiBjbGFzcz0ibW9kYWwtaGVhZGVyIj48YnV0dG9uIHR5cGU9ImJ1dHRvbiIgY2xhc3M9ImNsb3NlIiB0aXRsZT0iY2xvc2UiIG9uY2xpY2s9ImRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmYWtlX3ZlcmlmaWVkX2JhZGdlJykucmVtb3ZlKCkiPjxzcGFuIGNsYXNzPSJpY29uLWNsb3NlIj48L3NwYW4+PC9idXR0b24+PGg0IGNsYXNzPSJtb2RhbC10aXRsZSI+VmVyaWZpZWQgQmFkZ2U8L2g0PjwvZGl2PjxkaXYgY2xhc3M9Im1vZGFsLWJvZHkiPjxkaXY+PGRpdj48c3BhbiByb2xlPSJidXR0b24iIHRhYmluZGV4PSIwIiBkYXRhLXJibHgtdmVyaWZpZWQtYmFkZ2UtaWNvbj0iIiBkYXRhLXJibHgtYmFkZ2UtaWNvbj0idHJ1ZSIgY2xhc3M9Imh6LWNlbnRlcmVkLWJhZGdlLWNvbnRhaW5lciI+PGltZyBjbGFzcz0iIGpzczI3MiIgc3JjPSJkYXRhOmltYWdlL3N2Zyt4bWw7Y2hhcnNldD11dGYtOCwlM0NzdmcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB3aWR0aD0nMjgnIGhlaWdodD0nMjgnIHZpZXdCb3g9JzAgMCAyOCAyOCcgZmlsbD0nbm9uZSclM0UlM0NnIGNsaXAtcGF0aD0ndXJsKCUyM2NsaXAwXzhfNDYpJyUzRSUzQ3JlY3QgeD0nNS44ODgxOCcgd2lkdGg9JzIyLjg5JyBoZWlnaHQ9JzIyLjg5JyB0cmFuc2Zvcm09J3JvdGF0ZSgxNSA1Ljg4ODE4IDApJyBmaWxsPSclMjMwMDY2RkYnLyUzRSUzQ3BhdGggZmlsbC1ydWxlPSdldmVub2RkJyBjbGlwLXJ1bGU9J2V2ZW5vZGQnIGQ9J00yMC41NDMgOC43NTA4TDIwLjU0OSA4Ljc1NjhDMjEuMTUgOS4zNTc4IDIxLjE1IDEwLjMzMTggMjAuNTQ5IDEwLjkzMjhMMTEuODE3IDE5LjY2NDhMNy40NSAxNS4yOTY4QzYuODUgMTQuNjk1OCA2Ljg1IDEzLjcyMTggNy40NSAxMy4xMjE4TDcuNDU3IDEzLjExNDhDOC4wNTggMTIuNTEzOCA5LjAzMSAxMi41MTM4IDkuNjMzIDEzLjExNDhMMTEuODE3IDE1LjI5OThMMTguMzY3IDguNzUwOEMxOC45NjggOC4xNDk4IDE5Ljk0MiA4LjE0OTggMjAuNTQzIDguNzUwOFonIGZpbGw9J3doaXRlJy8lM0UlM0MvZyUzRSUzQ2RlZnMlM0UlM0NjbGlwUGF0aCBpZD0nY2xpcDBfOF80NiclM0UlM0NyZWN0IHdpZHRoPScyOCcgaGVpZ2h0PScyOCcgZmlsbD0nd2hpdGUnLyUzRSUzQy9jbGlwUGF0aCUzRSUzQy9kZWZzJTNFJTNDL3N2ZyUzRSIgdGl0bGU9IlZlcmlmaWVkIEJhZGdlIiBhbHQ9IlZlcmlmaWVkIEJhZGdlIj48L3NwYW4+PC9kaXY+PGRpdj5UaGlzIGJhZGdlIGlkZW50aWZpZXMgdGhhdCB0aGUgdXNlciBpcyB1c2luZyBFZmF6J3MgUm9ibG94IFZlcmlmaWVkIEJhZGdlIEFkZC1vbiEgVmlldyBleHRlbnNpb24gc2V0dGluZ3MgZm9yIG1vcmUgZGV0YWlscy48L2Rpdj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPSJtb2RhbC1mb290ZXIiPjxkaXYgY2xhc3M9ImxvYWRpbmciPjwvZGl2PjxkaXYgY2xhc3M9Im1vZGFsLWJ1dHRvbnMiPjxidXR0b24gdHlwZT0iYnV0dG9uIiBjbGFzcz0ibW9kYWwtYnV0dG9uIGJ0bi1jb250cm9sLW1kIGJ0bi1taW4td2lkdGgiIG9uY2xpY2s9ImRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmYWtlX3ZlcmlmaWVkX2JhZGdlJykucmVtb3ZlKCkiPkNsb3NlPC9idXR0b24+PC9kaXY+PC9kaXY+PC9kaXY+PC9kaXY+PC9kaXY+PC9kaXY+");
            var prompt_roblox_html = atob("PGRpdiByb2xlPSJkaWFsb2ciIGlkPSJmYWtlX3ZlcmlmaWVkX2JhZGdlIj48ZGl2IGNsYXNzPSJtb2RhbC1iYWNrZHJvcCBpbiI+PC9kaXY+PGRpdiByb2xlPSJkaWFsb2ciIHRhYmluZGV4PSItMSIgY2xhc3M9ImluIG1vZGFsIiBzdHlsZT0iZGlzcGxheTogYmxvY2s7Ij48ZGl2IGNsYXNzPSJtb2RhbC13aW5kb3cgbW9kYWwtc20gbW9kYWwtZGlhbG9nIj48ZGl2IGNsYXNzPSJtb2RhbC1jb250ZW50IiByb2xlPSJkb2N1bWVudCI+PGRpdiBjbGFzcz0ibW9kYWwtaGVhZGVyIj48YnV0dG9uIHR5cGU9ImJ1dHRvbiIgY2xhc3M9ImNsb3NlIiB0aXRsZT0iY2xvc2UiIG9uY2xpY2s9ImRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmYWtlX3ZlcmlmaWVkX2JhZGdlJykucmVtb3ZlKCkiPjxzcGFuIGNsYXNzPSJpY29uLWNsb3NlIj48L3NwYW4+PC9idXR0b24+PGg0IGNsYXNzPSJtb2RhbC10aXRsZSI+VmVyaWZpZWQgQmFkZ2U8L2g0PjwvZGl2PjxkaXYgY2xhc3M9Im1vZGFsLWJvZHkiPjxkaXY+PGRpdj48c3BhbiByb2xlPSJidXR0b24iIHRhYmluZGV4PSIwIiBkYXRhLXJibHgtdmVyaWZpZWQtYmFkZ2UtaWNvbj0iIiBkYXRhLXJibHgtYmFkZ2UtaWNvbj0idHJ1ZSIgY2xhc3M9Imh6LWNlbnRlcmVkLWJhZGdlLWNvbnRhaW5lciI+PGltZyBjbGFzcz0iIGpzczI3MiIgc3JjPSJkYXRhOmltYWdlL3N2Zyt4bWw7Y2hhcnNldD11dGYtOCwlM0NzdmcgeG1sbnM9J2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJyB3aWR0aD0nMjgnIGhlaWdodD0nMjgnIHZpZXdCb3g9JzAgMCAyOCAyOCcgZmlsbD0nbm9uZSclM0UlM0NnIGNsaXAtcGF0aD0ndXJsKCUyM2NsaXAwXzhfNDYpJyUzRSUzQ3JlY3QgeD0nNS44ODgxOCcgd2lkdGg9JzIyLjg5JyBoZWlnaHQ9JzIyLjg5JyB0cmFuc2Zvcm09J3JvdGF0ZSgxNSA1Ljg4ODE4IDApJyBmaWxsPSclMjMwMDY2ZmYnLyUzRSUzQ3BhdGggZmlsbC1ydWxlPSdldmVub2RkJyBjbGlwLXJ1bGU9J2V2ZW5vZGQnIGQ9J00yMC41NDMgOC43NTA4TDIwLjU0OSA4Ljc1NjhDMjEuMTUgOS4zNTc4IDIxLjE1IDEwLjMzMTggMjAuNTQ5IDEwLjkzMjhMMTEuODE3IDE5LjY2NDhMNy40NSAxNS4yOTY4QzYuODUgMTQuNjk1OCA2Ljg1IDEzLjcyMTggNy40NSAxMy4xMjE4TDcuNDU3IDEzLjExNDhDOC4wNTggMTIuNTEzOCA5LjAzMSAxMi41MTM4IDkuNjMzIDEzLjExNDhMMTEuODE3IDE1LjI5OThMMTguMzY3IDguNzUwOEMxOC45NjggOC4xNDk4IDE5Ljk0MiA4LjE0OTggMjAuNTQzIDguNzUwOFonIGZpbGw9J3doaXRlJy8lM0UlM0MvZyUzRSUzQ2RlZnMlM0UlM0NjbGlwUGF0aCBpZD0nY2xpcDBfOF80NiclM0UlM0NyZWN0IHdpZHRoPScyOCcgaGVpZ2h0PScyOCcgZmlsbD0nd2hpdGUnLyUzRSUzQy9jbGlwUGF0aCUzRSUzQy9kZWZzJTNFJTNDL3N2ZyUzRSIgdGl0bGU9IlZlcmlmaWVkIEJhZGdlIiBhbHQ9IlZlcmlmaWVkIEJhZGdlIj48L3NwYW4+PC9kaXY+PGRpdj5UaGlzIGJhZGdlIHZlcmlmaWVzIHRoYXQgdGhlIGhvbGRlciBpcyBhIG5vdGFibGUgYW5kIGF1dGhlbnRpYyBjcmVhdG9yLCBicmFuZCwgb3IgcHVibGljIGZpZ3VyZS48L2Rpdj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPSJtb2RhbC1mb290ZXIiPjxkaXYgY2xhc3M9ImxvYWRpbmciPjwvZGl2PjxkaXYgY2xhc3M9Im1vZGFsLWJ1dHRvbnMiPjxidXR0b24gdHlwZT0iYnV0dG9uIiBjbGFzcz0ibW9kYWwtYnV0dG9uIGJ0bi1wcmltYXJ5LW1kIGJ0bi1taW4td2lkdGgiIG9uY2xpY2s9IndpbmRvdy5sb2NhdGlvbi5yZXBsYWNlKCdodHRwczovL2VuLmhlbHAucm9ibG94LmNvbS9oYy9lbi11cy9hcnRpY2xlcy83OTk3MjA3MjU5MTU2JykiPkxlYXJuIE1vcmU8L2J1dHRvbj48YnV0dG9uIHR5cGU9ImJ1dHRvbiIgY2xhc3M9Im1vZGFsLWJ1dHRvbiBidG4tY29udHJvbC1tZCBidG4tbWluLXdpZHRoIiBvbmNsaWNrPSJkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmFrZV92ZXJpZmllZF9iYWRnZScpLnJlbW92ZSgpIj5DbG9zZTwvYnV0dG9uPjwvZGl2PjwvZGl2PjwvZGl2PjwvZGl2PjwvZGl2PjwvZGl2Pg==");
            var game_html = atob("PHNwYW4gcm9sZT0iYnV0dG9uIiB0YWJpbmRleD0iMCIgc2VjdXJlZC1hcHBsZXMtdmVyaWZpZWQtYmFkZ2UtYnV0dG9uPSJ5ZXNzc3MiIGRhdGEtcmJseC12ZXJpZmllZC1iYWRnZS1pY29uPSIiIGRhdGEtcmJseC1iYWRnZS1pY29uPSJ0cnVlIiBjbGFzcz0ianNzNCI+PGltZyBjbGFzcz0idmVyaWZpZWQtYmFkZ2UtaWNvbi1leHBlcmllbmNlLWNyZWF0b3IiIHN0eWxlPSJtYXJnaW4tbGVmdDogNHB4O3dpZHRoOiAxNnB4O2hlaWdodDogMTZweDsiIHNyYz0iZGF0YTppbWFnZS9zdmcreG1sO2NoYXJzZXQ9dXRmLTgsJTNDc3ZnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zycgd2lkdGg9JzI4JyBoZWlnaHQ9JzI4JyB2aWV3Qm94PScwIDAgMjggMjgnIGZpbGw9J25vbmUnJTNFJTNDZyBjbGlwLXBhdGg9J3VybCglMjNjbGlwMF84XzQ2KSclM0UlM0NyZWN0IHg9JzUuODg4MTgnIHdpZHRoPScyMi44OScgaGVpZ2h0PScyMi44OScgdHJhbnNmb3JtPSdyb3RhdGUoMTUgNS44ODgxOCAwKScgZmlsbD0nJTIzMDA2NkZGJy8lM0UlM0NwYXRoIGZpbGwtcnVsZT0nZXZlbm9kZCcgY2xpcC1ydWxlPSdldmVub2RkJyBkPSdNMjAuNTQzIDguNzUwOEwyMC41NDkgOC43NTY4QzIxLjE1IDkuMzU3OCAyMS4xNSAxMC4zMzE4IDIwLjU0OSAxMC45MzI4TDExLjgxNyAxOS42NjQ4TDcuNDUgMTUuMjk2OEM2Ljg1IDE0LjY5NTggNi44NSAxMy43MjE4IDcuNDUgMTMuMTIxOEw3LjQ1NyAxMy4xMTQ4QzguMDU4IDEyLjUxMzggOS4wMzEgMTIuNTEzOCA5LjYzMyAxMy4xMTQ4TDExLjgxNyAxNS4yOTk4TDE4LjM2NyA4Ljc1MDhDMTguOTY4IDguMTQ5OCAxOS45NDIgOC4xNDk4IDIwLjU0MyA4Ljc1MDhaJyBmaWxsPSd3aGl0ZScvJTNFJTNDL2clM0UlM0NkZWZzJTNFJTNDY2xpcFBhdGggaWQ9J2NsaXAwXzhfNDYnJTNFJTNDcmVjdCB3aWR0aD0nMjgnIGhlaWdodD0nMjgnIGZpbGw9J3doaXRlJy8lM0UlM0MvY2xpcFBhdGglM0UlM0MvZGVmcyUzRSUzQy9zdmclM0UiIHRpdGxlPSJWZXJpZmllZCBCYWRnZSBJY29uIiBhbHQ9IlZlcmlmaWVkIEJhZGdlIEljb24iPjwvc3Bhbj4=");
            var name_small_html = atob("PHNwYW4+PHNwYW4gcm9sZT0iYnV0dG9uIiB0YWJpbmRleD0iMCIgZGF0YS1yYmx4LXZlcmlmaWVkLWJhZGdlLWljb249IiIgc2VjdXJlZC1hcHBsZXMtdmVyaWZpZWQtYmFkZ2UtYnV0dG9uPSJ5ZXNz c3MiIGRhdGEtcmJseC1iYWRnZS1pY29uPSJ0cnVlIiBjbGFzcz0ianNzMjIiPjxpbWcgY2xhc3M9 InZlcmlmaWVkLWJhZGdlLWljb24tbWVtYmVyLWNhcmQtcmVuZGVyZWQiIHNyYz0iZGF0YTppbWFn ZS9zdmcreG1sO2NoYXJzZXQ9dXRmLTgsJTNDc3ZnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8y MDAwL3N2Zycgd2lkdGg9JzI4JyBoZWlnaHQ9JzI4JyB2aWV3Qm94PScwIDAgMjggMjgnIGZpbGw9 J25vbmUnJTNFJTNDZyBjbGlwLXBhdGg9J3VybCglMjNjbGlwMF84XzQ2KSclM0UlM0NyZWN0IHg9 JzUuODg4MTgnIHdpZHRoPScyMi44OScgaGVpZ2h0PScyMi44OScgdHJhbnNmb3JtPSdyb3RhdGUo MTUgNS44ODgxOCAwKScgZmlsbD0nJTIzMDA2NkZGJy8lM0UlM0NwYXRoIGZpbGwtcnVsZT0nZXZl bm9kZCcgY2xpcC1ydWxlPSdldmVub2RkJyBkPSdNMjAuNTQzIDguNzUwOEwyMC41NDkgOC43NTY4 QzIxLjE1IDkuMzU3OCAyMS4xNSAxMC4zMzE4IDIwLjU0OSAxMC45MzI4TDExLjgxNyAxOS42NjQ4 TDcuNDUgMTUuMjk2OEM2Ljg1IDE0LjY5NTggNi44NSAxMy43MjE4IDcuNDUgMTMuMTIxOEw3LjQ1 NyAxMy4xMTQ4QzguMDU4IDEyLjUxMzggOS4wMzEgMTIuNTEzOCA5LjYzMyAxMy4xMTQ4TDExLjgx NyAxNS4yOTk4TDE4LjM2NyA4Ljc1MDhDMTguOTY4IDguMTQ5OCAxOS45NDIgOC4xNDk4IDIwLjU0 MyA4Ljc1MDhaJyBmaWxsPSd3aGl0ZScvJTNFJTNDL2clM0UlM0NkZWZzJTNFJTNDY2xpcFBhdGgg aWQ9J2NsaXAwXzhfNDYnJTNFJTNDcmVjdCB3aWR0aD0nMjgnIGhlaWdodD0nMjgnIGZpbGw9J3do aXRlJy8lM0UlM0MvY2xpcFBhdGglM0UlM0MvZGVmcyUzRSUzQy9zdmclM0UiIHRpdGxlPSJWZXJp ZmllZCBCYWRnZSBJY29uIiBhbHQ9IlZlcmlmaWVkIEJhZGdlIEljb24iPjwvc3Bhbj48L3NwYW4+");
            var group_name_verified_html = atob("PHNwYW4gcm9sZT0iYnV0dG9uIiB0YWJpbmRleD0iMCIgZGF0YS1yYmx4LXZlcmlmaWVkLWJhZGdlLWljb249IiIgc2VjdXJlZC1hcHBsZXMtdmVyaWZpZWQtYmFkZ2UtYnV0dG9uPSJ5ZXNzc3MiIGRhdGEtcmJseC1iYWRnZS1pY29uPSJ0cnVlIiBjbGFzcz0ianNzMjUwIj48aW1nIGNsYXNzPSJ2ZXJpZmllZC1iYWRnZS1pY29uLWdyb3VwLW5hbWUtcmVuZGVyZWQiIHNyYz0iZGF0YTppbWFnZS9zdmcreG1sO2NoYXJzZXQ9dXRmLTgsJTNDc3ZnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zycgd2lkdGg9JzI4JyBoZWlnaHQ9JzI4JyB2aWV3Qm94PScwIDAgMjggMjgnIGZpbGw9J25vbmUnJTNFJTNDZyBjbGlwLXBhdGg9J3VybCglMjNjbGlwMF84XzQ2KSclM0UlM0NyZWN0IHg9JzUuODg4MTgnIHdpZHRoPScyMi44OScgaGVpZ2h0PScyMi44OScgdHJhbnNmb3JtPSdyb3RhdGUoMTUgNS44ODgxOCAwKScgZmlsbD0nJTIzMDA2NkZGJy8lM0UlM0NwYXRoIGZpbGwtcnVsZT0nZXZlbm9kZCcgY2xpcC1ydWxlPSdldmVub2RkJyBkPSdNMjAuNTQzIDguNzUwOEwyMC41NDkgOC43NTY4QzIxLjE1IDkuMzU3OCAyMS4xNSAxMC4zMzE4IDIwLjU0OSAxMC45MzI4TDExLjgxNyAxOS42NjQ4TDcuNDUgMTUuMjk2OEM2Ljg1IDE0LjY5NTggNi44NSAxMy43MjE4IDcuNDUgMTMuMTIxOEw3LjQ1NyAxMy4xMTQ4QzguMDU4IDEyLjUxMzggOS4wMzEgMTIuNTEzOCA5LjYzMyAxMy4xMTQ4TDExLjgxNyAxNS4yOTk4TDE4LjM2NyA4Ljc1MDhDMTguOTY4IDguMTQ5OCAxOS45NDIgOC4xNDk4IDIwLjU0MyA4Ljc1MDhaJyBmaWxsPSd3aGl0ZScvJTNFJTNDL2clM0UlM0NkZWZzJTNFJTNDY2xpcFBhdGggaWQ9J2NsaXAwXzhfNDYnJTNFJTNDcmVjdCB3aWR0aD0nMjgnIGhlaWdodD0nMjgnIGZpbGw9J3doaXRlJy8lM0UlM0MvY2xpcFBhdGglM0UlM0MvZGVmcyUzRSUzQy9zdmclM0UiIHRpdGxlPSJWZXJpZmllZCBCYWRnZSBJY29uIiBhbHQ9IlZlcmlmaWVkIEJhZGdlIEljb24iPjwvc3Bhbj4=");

            if (window.verifiedCheckmarkSettings) {
                var custom_checkmark_color = window.verifiedCheckmarkSettings["color"]
                if (custom_checkmark_color) {
                    custom_checkmark_color = custom_checkmark_color.replace("#", "%23");
                    profile_html = profile_html.replace("%230066FF", custom_checkmark_color);
                    name_html = name_html.replace("%230066FF", custom_checkmark_color);
                    name_html_larger = name_html_larger.replace("%230066FF", custom_checkmark_color);
                    name_side_real_html = name_side_real_html.replace("%230066FF", custom_checkmark_color);
                    name_side_html = name_side_html.replace("%230066FF", custom_checkmark_color);
                    prompt_html = prompt_html.replace("%230066FF", custom_checkmark_color);
                    prompt_roblox_html = prompt_roblox_html.replace("%230066FF", custom_checkmark_color);
                    game_html = game_html.replace("%230066FF", custom_checkmark_color);
                    name_small_html = name_small_html.replace("%230066FF", custom_checkmark_color);
                    group_name_verified_html = group_name_verified_html.replace("%230066FF", custom_checkmark_color);
                }
            }

            async function getUserData() {
                return fetch("https://users.roblox.com/v1/users/authenticated", {
                    "headers": {
                        "accept": "application/json",
                        "accept-language": "en-US,en;q=0.9",
                        "cache-control": "no-cache",
                        "pragma": "no-cache",
                        "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"macOS\"",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-origin"
                    },
                    "referrer": "https://users.roblox.com/docs/index.html",
                    "referrerPolicy": "strict-origin-when-cross-origin",
                    "body": null,
                    "method": "GET",
                    "mode": "cors",
                    "credentials": "include"
                }).then(res => {
                    return res.json()
                });
            }
            function getIfVerified() {
                return window.set_verified == true;
            }
            if (getIfVerified() == true) {
                if (allow_messages) alert("You already applied the verified badge effect on this page!");
            } else {
                getUserData()
                    .then(res => {
                        if (res) {
                            return res
                        } else {
                            return {};
                        }
                    })
                    .then(json => {
                        if (json["id"]) {
                            var userId = json["id"];
                            var include_groups = false;
                            var allowed_groups = [];

                            if (window.verifiedCheckmarkSettings) {
                                if (window.verifiedCheckmarkSettings["groupsIncluded"] == true) {
                                    include_groups = true;
                                }
                            }

                            function promptMessage() {
                                if (window.verifiedCheckmarkSettings) {
                                    var verified_prompt_enabled = window.verifiedCheckmarkSettings["verifiedPrompt"];
                                    var use_roblox_prompt = window.verifiedCheckmarkSettings["defaultPrompt"];
                                    if (verified_prompt_enabled == true) {
                                        if (use_roblox_prompt == true) {
                                            const placeholder = document.createRange().createContextualFragment(`<div>${prompt_roblox_html}</div>`);
                                            if (!(document.getElementById("fake_verified_badge"))) {
                                                document.body.appendChild(placeholder.children[0].children[0]);
                                            }
                                        } else {
                                            const placeholder = document.createRange().createContextualFragment(`<div>${prompt_html}</div>`);
                                            if (!(document.getElementById("fake_verified_badge"))) {
                                                document.body.appendChild(placeholder.children[0].children[0]);
                                            }
                                        }
                                    }
                                }
                            }

                            function addPromptButtonInput() {
                                var list_item = document.getElementsByTagName("span");
                                list_item = Array.prototype.slice.call(list_item);

                                if (list_item.length > 0) {
                                    list_item.forEach((verified_badge_contain) => {
                                        if (verified_badge_contain.getAttribute("secured-apples-verified-badge-button")) {
                                            if (verified_badge_contain.getAttribute("secured-apples-verified-badge-button") == "yessss") {
                                                verified_badge_contain.setAttribute("secured-apples-verified-badge-button", "nooooo")
                                                verified_badge_contain.addEventListener("click", promptMessage);
                                            }
                                        }
                                    });
                                }
                            }

                            profile_html = profile_html.replace("[input_id]", userId).replace("[input_id]", userId).replace("[input_id]", userId).replace("[input_id]", userId);

                            if (window.location.pathname == `/users/${userId}/profile`) {
                                var main_headers = document.getElementsByClassName("header-title");
                                main_headers = Array.prototype.slice.call(main_headers);
                                if (main_headers.length > 0) {
                                    var premium_logos = document.getElementsByClassName("premium-badge-right-aligned");
                                    premium_logos = Array.prototype.slice.call(premium_logos);
                                    if (premium_logos.length > 0) {
                                        premium_logos.forEach((premium) => {
                                            premium.remove();
                                        });
                                    }
                                    main_headers.forEach((main_header) => {
                                        main_header.innerHTML = main_header.innerHTML + profile_html;
                                    });
                                }
                            }

                            var name_on_side = document.getElementsByClassName("font-header-2 dynamic-ellipsis-item");
                            name_on_side = Array.prototype.slice.call(name_on_side);
                            if (name_on_side.length > 0) {
                                name_on_side.forEach((main_name_on_side) => {
                                    if (main_name_on_side.outerHTML.includes(json["displayName"])) {
                                        main_name_on_side.innerHTML = `${main_name_on_side.innerHTML} ${name_side_real_html}`;
                                    }
                                });
                            }

                            var group_owners = document.getElementsByClassName("text-link ng-binding ng-scope");
                            group_owners = Array.prototype.slice.call(group_owners);
                            if (group_owners.length > 0) {
                                function applyCallback() {
                                    var group_owners = document.getElementsByClassName("text-link ng-binding ng-scope");
                                    group_owners = Array.prototype.slice.call(group_owners);
                                    group_owners.forEach((group_owner_name) => {
                                        if (group_owner_name.outerHTML.includes(json["displayName"]) && group_owner_name.href == `https://www.roblox.com/users/${userId}/profile`) {
                                            group_owner_name.innerHTML = `${json["displayName"]} ${name_side_html.replace("12px", "14px").replace("12px", "14px")}`;

                                            if (window.verifiedCheckmarkSettings) {
                                                if (window.verifiedCheckmarkSettings["groupsIncluded"] == true) {
                                                    var group_name = document.getElementsByClassName("group-name text-overflow ng-binding ng-scope");
                                                    group_name = Array.prototype.slice.call(group_name);
                                                    if (group_name.length > 0) {
                                                        group_name.forEach((main_name_on_group) => {
                                                            if (main_name_on_group.innerHTML.includes("data-rblx-verified-badge-icon")) {
                                                                return
                                                            }
                                                            main_name_on_group.innerHTML = `${main_name_on_group.innerHTML} ${group_name_verified_html}`;
                                                        });
                                                    }
                                                }
                                            }
                                        }
                                    });

                                    var group_shouts = document.getElementsByClassName("text-name name ng-binding ng-scope");
                                    group_shouts = Array.prototype.slice.call(group_shouts);
                                    if (group_shouts.length > 0) {
                                        var shout = group_shouts[0];
                                        if (shout.outerHTML.includes(json["displayName"]) && shout.href == `https://www.roblox.com/users/${userId}/profile`) {
                                            if (shout.parentElement.innerHTML.includes("data-rblx-verified-badge-icon")) {
                                                return
                                            }
                                            shout.outerHTML = `${shout.outerHTML} ${name_html_larger}`;
                                        }
                                    }

                                    var name_in_group = document.getElementsByClassName("text-overflow font-caption-header member-name ng-binding ng-scope");
                                    name_in_group = Array.prototype.slice.call(name_in_group);
                                    if (name_in_group.length > 0) {
                                        name_in_group.forEach((main_name_on_group) => {
                                            if (main_name_on_group.outerHTML.includes(json["displayName"])) {
                                                if (main_name_on_group.offsetParent.offsetParent.id == `member-${userId}`) {
                                                    if (main_name_on_group.parentElement.innerHTML.includes("data-rblx-verified-badge-icon")) {
                                                        return
                                                    }
                                                    main_name_on_group.outerHTML = `${main_name_on_group.outerHTML} ${name_side_html}`;
                                                }
                                            }
                                        });
                                    }

                                    var group_payouts_auto = document.getElementsByClassName("avatar-card-name text-lead text-overflow ng-binding ng-scope");
                                    group_payouts_auto = Array.prototype.slice.call(group_payouts_auto);
                                    if (group_payouts_auto.length > 0) {
                                        group_payouts_auto.forEach((main_name_on_group) => {
                                            if (main_name_on_group.outerHTML.includes(json["displayName"]) && main_name_on_group.href == `https://www.roblox.com/users/${userId}/profile`) {
                                                if (main_name_on_group.parentElement.innerHTML.includes("data-rblx-verified-badge-icon")) {
                                                    return
                                                }
                                                main_name_on_group.outerHTML = `${main_name_on_group.outerHTML} ${name_side_html}`;
                                            }
                                        });
                                    }

                                    setTimeout(() => {
                                        var list_item = document.getElementsByClassName("group-comments vlist");
                                        list_item = Array.prototype.slice.call(list_item);
                                        if (list_item.length > 0) {
                                            var group_list_comments = list_item[0];
                                            applied_updating_v2 = true;
                                            var observer = new MutationObserver(() => {
                                                var group_wall = document.getElementsByClassName("text-name ng-binding ng-scope");
                                                group_wall = Array.prototype.slice.call(group_wall);
                                                if (group_wall.length > 0) {
                                                    group_wall.forEach((main_name_on_group) => {
                                                        if (main_name_on_group.outerHTML.includes(json["displayName"]) && main_name_on_group.className == "text-name ng-binding ng-scope" && main_name_on_group.href == `https://www.roblox.com/users/${userId}/profile`) {
                                                            main_name_on_group.innerHTML = `${main_name_on_group.innerHTML} ${name_side_html.replace("12px", "14px").replace("12px", "14px")}`;
                                                        }
                                                    });
                                                }
                                            });
                                            observer.observe(group_list_comments, { attributes: true, childList: true });
                                        }

                                        setTimeout(() => {
                                            var group_div = document.getElementsByClassName("ng-scope");
                                            group_div = Array.prototype.slice.call(group_div);
                                            if (group_div.length > 0) {
                                                group_div.forEach((user_container) => {
                                                    if ((user_container.className == "ng-scope" || user_container.className == "btr-group-container ng-scope btr-hasGames btr-hasPayouts") && user_container.getAttribute("ng-if") == "!isLockedGroup() && !isGroupRestrictedByPolicy() && !layout.loadGroupMetadataError") {
                                                        var observer = new MutationObserver(applyCallback);
                                                        observer.observe(user_container, { attributes: true, childList: true });
                                                    }
                                                });
                                            }

                                            var member_list = document.getElementsByClassName("hlist");
                                            member_list = Array.prototype.slice.call(member_list);
                                            if (member_list.length > 1) {
                                                var group_list_comments = member_list[1];
                                                applied_updating_v2 = true;
                                                var observer = new MutationObserver(applyCallback);
                                                observer.observe(group_list_comments, { attributes: true, childList: true });
                                            }
                                            addPromptButtonInput()
                                        }, 1000);
                                        addPromptButtonInput()
                                    }, 1000);
                                }
                                var applied_updating = false;
                                var applied_updating_v2 = false;
                                group_owners.forEach((group_owner_name) => {
                                    if (group_owner_name.innerHTML.includes(json["displayName"]) && group_owner_name.href == `https://www.roblox.com/users/${userId}/profile`) {
                                        group_owner_name.innerHTML = `${json["displayName"]} ${name_side_html}`;

                                        if (window.verifiedCheckmarkSettings) {
                                            if (window.verifiedCheckmarkSettings["groupsIncluded"] == true) {
                                                var group_name = document.getElementsByClassName("group-name text-overflow ng-binding ng-scope");
                                                group_name = Array.prototype.slice.call(group_name);
                                                if (group_name.length > 0) {
                                                    group_name.forEach((main_name_on_group) => {
                                                        main_name_on_group.innerHTML = `${main_name_on_group.innerHTML} ${group_name_verified_html}`;
                                                    });
                                                }
                                            }
                                        }

                                        if (applied_updating == false) {
                                            var group_headers = document.getElementsByClassName("group-title");
                                            group_headers = Array.prototype.slice.call(group_headers);
                                            if (group_headers.length > 0) {
                                                var group_header = group_headers[1];
                                                applied_updating = true;
                                                var observer = new MutationObserver(applyCallback);
                                                observer.observe(group_header, { attributes: true, childList: true });
                                            }
                                        }
                                    }
                                });

                                if (window.verifiedCheckmarkSettings) {
                                    if (window.verifiedCheckmarkSettings["groupsIncluded"] == true) {
                                        var group_list_verified_logo = document.getElementsByTagName("groups-list-item");
                                        group_list_verified_logo = Array.prototype.slice.call(group_list_verified_logo);
                                        if (group_list_verified_logo.length > 0) {
                                            group_list_verified_logo.forEach((main_name_on_group) => {
                                                if (main_name_on_group.parentElement.getAttribute("ng-repeat")) {
                                                    if (main_name_on_group.parentElement.getAttribute("ng-repeat").includes("filter: { isOwner: true }")) {
                                                        if (main_name_on_group.children[0] && main_name_on_group.children[0].children[0] && main_name_on_group.children[0].children[0].children[1]) {
                                                            main_name_on_group = main_name_on_group.children[0].children[0].children[1];
                                                            main_name_on_group.innerHTML = `${main_name_on_group.innerHTML} ${name_side_html}`;
                                                        }
                                                    }
                                                } else if (main_name_on_group.parentElement.className.includes("primary-group")) {
                                                    if (main_name_on_group.children[0] && main_name_on_group.children[0].children[0] && main_name_on_group.children[0].children[0].children[1]) {
                                                        main_name_on_group = main_name_on_group.children[0].children[0].children[1];
                                                        main_name_on_group.innerHTML = `${main_name_on_group.innerHTML} ${name_side_html}`;
                                                    }
                                                }
                                            });
                                        }
                                    }
                                }

                                var group_shouts = document.getElementsByClassName("text-name name ng-binding ng-scope");
                                group_shouts = Array.prototype.slice.call(group_shouts);
                                if (group_shouts.length > 0) {
                                    var shout = group_shouts[0];
                                    if (shout.outerHTML.includes(json["displayName"]) && shout.href == `https://www.roblox.com/users/${userId}/profile`) {
                                        shout.outerHTML = `${shout.outerHTML} ${name_html_larger}`;
                                    }
                                }

                                var group_payouts_auto = document.getElementsByClassName("avatar-card-name text-lead text-overflow ng-binding ng-scope");
                                group_payouts_auto = Array.prototype.slice.call(group_payouts_auto);
                                if (group_payouts_auto.length > 0) {
                                    group_payouts_auto.forEach((main_name_on_group) => {
                                        if (main_name_on_group.outerHTML.includes(json["displayName"]) && main_name_on_group.href == `https://www.roblox.com/users/${userId}/profile`) {
                                            main_name_on_group.outerHTML = `${main_name_on_group.outerHTML} ${name_side_html}`;
                                        }
                                    });
                                }

                                var name_in_group = document.getElementsByClassName("text-overflow font-caption-header member-name ng-binding ng-scope");
                                name_in_group = Array.prototype.slice.call(name_in_group);
                                if (name_in_group.length > 0) {
                                    name_in_group.forEach((main_name_on_group) => {
                                        if (main_name_on_group.outerHTML.includes(json["displayName"])) {
                                            if (main_name_on_group.offsetParent.offsetParent.id == `member-${userId}`) {
                                                main_name_on_group.outerHTML = `${main_name_on_group.outerHTML} ${name_side_html}`;
                                            }
                                        }
                                    });
                                }

                                var group_wall = document.getElementsByClassName("text-name ng-binding ng-scope");
                                group_wall = Array.prototype.slice.call(group_wall);
                                if (group_wall.length > 0) {
                                    group_wall.forEach((main_name_on_group) => {
                                        if (main_name_on_group.outerHTML.includes(json["displayName"]) && main_name_on_group.className == "text-name ng-binding ng-scope" && main_name_on_group.href == `https://www.roblox.com/users/${userId}/profile`) {
                                            main_name_on_group.outerHTML = `${main_name_on_group.outerHTML} ${name_side_html}`;
                                        }
                                    });
                                }

                                setTimeout(() => {
                                    var list_item = document.getElementsByClassName("group-comments vlist");
                                    list_item = Array.prototype.slice.call(list_item);
                                    if (list_item.length > 0) {
                                        var group_list_comments = list_item[0];
                                        applied_updating_v2 = true;
                                        var observer = new MutationObserver(() => {
                                            var group_wall = document.getElementsByClassName("text-name ng-binding ng-scope");
                                            group_wall = Array.prototype.slice.call(group_wall);
                                            if (group_wall.length > 0) {
                                                group_wall.forEach((main_name_on_group) => {
                                                    if (main_name_on_group.outerHTML.includes(json["displayName"]) && main_name_on_group.className == "text-name ng-binding ng-scope" && main_name_on_group.href == `https://www.roblox.com/users/${userId}/profile`) {
                                                        main_name_on_group.innerHTML = `${main_name_on_group.innerHTML} ${name_side_html.replace("12px", "14px").replace("12px", "14px")}`;
                                                    }
                                                });
                                            }
                                        });
                                        observer.observe(group_list_comments, { attributes: true, childList: true });
                                    }

                                    setTimeout(() => {
                                        var group_div = document.getElementsByClassName("ng-scope");
                                        group_div = Array.prototype.slice.call(group_div);
                                        if (group_div.length > 0) {
                                            group_div.forEach((user_container) => {
                                                if ((user_container.className == "ng-scope" || user_container.className == "btr-group-container ng-scope btr-hasGames btr-hasPayouts") && user_container.getAttribute("ng-if") == "!isLockedGroup() && !isGroupRestrictedByPolicy() && !layout.loadGroupMetadataError") {
                                                    var observer = new MutationObserver(applyCallback);
                                                    observer.observe(user_container, { attributes: true, childList: true });
                                                }
                                            });
                                        }

                                        var member_list = document.getElementsByClassName("hlist");
                                        member_list = Array.prototype.slice.call(member_list);
                                        if (member_list.length > 1) {
                                            var group_list_comments = member_list[1];
                                            applied_updating_v2 = true;
                                            var observer = new MutationObserver(applyCallback);
                                            observer.observe(group_list_comments, { attributes: true, childList: true });
                                        }
                                    }, 1000);
                                }, 1000);

                                if (applied_updating_v2 == false) {
                                    var list_item = document.getElementsByClassName("tab-content rbx-tab-content col-xs-12");
                                    list_item = Array.prototype.slice.call(list_item);
                                    if (list_item.length > 0) {
                                        var group_list_header = list_item[0];
                                        applied_updating_v2 = true;
                                        var observer = new MutationObserver(applyCallback);
                                        observer.observe(group_list_header, { attributes: true, childList: true });
                                    }
                                }
                            }

                            var username_containers = document.getElementsByClassName("user-name-container");
                            username_containers = Array.prototype.slice.call(username_containers);
                            if (username_containers.length > 0) {
                                username_containers.forEach((user_container) => {
                                    if (user_container.innerHTML.includes(json["displayName"])) {
                                        user_container.innerHTML = `${user_container.innerHTML} ${name_html}`;
                                    }
                                });
                            }

                            function applyAutoChangeFunctionB() {
                                setTimeout(function () {
                                    var username_containers_2 = document.getElementsByClassName("creator-name text-link");
                                    username_containers_2 = Array.prototype.slice.call(username_containers_2);
                                    if (username_containers_2.length > 0) {
                                        username_containers_2.forEach((user_container) => {
                                            if (user_container.outerHTML.includes(`@${json["name"]}`) && user_container.className == "creator-name text-link") {
                                                user_container.outerHTML = `${user_container.outerHTML} ${name_side_html}`;
                                            }
                                            if (include_groups == true) {
                                                if (user_container.className == "creator-name text-link") {
                                                    if (user_container.href && user_container.href.includes("/groups/")) {
                                                        var group_id = user_container.href.match(/[0-9]+/)[0];
                                                        var generated_group_api_link = `https://groups.roblox.com/v1/groups/${group_id}`;
                                                        if (allowed_groups[group_id] && allowed_groups[group_id]["accepted"] == true) {
                                                            if (user_container.className == "creator-name text-link") {
                                                                if (user_container.outerHTML.includes(allowed_groups[group_id]["name"])) {
                                                                    user_container.outerHTML = `${user_container.outerHTML} ${name_side_html}`;
                                                                }
                                                            }
                                                        } else {
                                                            fetch(generated_group_api_link).then(grou_res => { return grou_res.json(); }).then(grou_json => {
                                                                if (grou_json["owner"]) {
                                                                    if (grou_json["owner"]["userId"] == userId) {
                                                                        grou_json["accepted"] = true
                                                                        allowed_groups[group_id] = grou_json
                                                                        if (user_container.className == "creator-name text-link") {
                                                                            if (user_container.outerHTML.includes(grou_json["name"])) {
                                                                                user_container.outerHTML = `${user_container.outerHTML} ${name_side_html}`;
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            });
                                                        }
                                                    }
                                                }
                                            }
                                        });
                                    }

                                    var username_containers_7 = document.getElementsByClassName("avatar-name text-overflow ng-binding");
                                    username_containers_7 = Array.prototype.slice.call(username_containers_7);
                                    if (username_containers_7.length > 0) {
                                        username_containers_7.forEach((user_container) => {
                                            if (user_container.outerHTML.includes(`${json["displayName"]}`) && user_container.className == "avatar-name text-overflow ng-binding") {
                                                if (user_container.parentElement.parentElement.children[1].outerHTML.includes(`@${json["name"]}`)) {
                                                    user_container.outerHTML = `${user_container.outerHTML} ${name_small_html}`;
                                                }
                                            }
                                        });
                                    }

                                    var username_containers_8 = document.getElementsByClassName("text-overflow avatar-name ng-binding ng-scope");
                                    username_containers_8 = Array.prototype.slice.call(username_containers_8);
                                    if (username_containers_8.length > 0) {
                                        username_containers_8.forEach((user_container) => {
                                            if (user_container.outerHTML.includes(`${json["displayName"]}`) && user_container.className == "text-overflow avatar-name ng-binding ng-scope") {
                                                var username_containers_9 = document.getElementsByClassName("text-overflow avatar-card-label ng-binding ng-scope");
                                                username_containers_9 = Array.prototype.slice.call(username_containers_9);
                                                if (username_containers_9.length > 0) {
                                                    username_containers_9.forEach((user_container_2) => {
                                                        if (user_container.offsetParent == user_container_2.offsetParent) {
                                                            if (user_container_2.innerText == `@${json["name"]}`) {
                                                                user_container.outerHTML = `${user_container.outerHTML} ${name_side_html}`;
                                                            }
                                                        }
                                                    });
                                                }
                                            }
                                        });
                                    }

                                    setTimeout(function () {
                                        var list_item = document.getElementsByClassName("search-result avatar-cards ng-scope");
                                        list_item = Array.prototype.slice.call(list_item);
                                        if (list_item.length > 0) {
                                            var catalog_list_header = list_item[0];
                                            var observer = new MutationObserver(applyAutoChangeFunctionB);
                                            observer.observe(catalog_list_header, { childList: true });
                                        }

                                        addPromptButtonInput()
                                    }, 1000);
                                    addPromptButtonInput()
                                }, 1000);
                            }

                            function applyAutoChangeFunctionC() {
                                setTimeout(function () {
                                    var username_containers_7 = document.getElementsByClassName("avatar-name text-overflow ng-binding");
                                    username_containers_7 = Array.prototype.slice.call(username_containers_7);
                                    if (username_containers_7.length > 0) {
                                        username_containers_7.forEach((user_container) => {
                                            if (user_container.outerHTML.includes(`${json["displayName"]}`) && user_container.className == "avatar-name text-overflow ng-binding") {
                                                if (user_container.parentElement.parentElement.children[1].outerHTML.includes(`@${json["name"]}`)) {
                                                    user_container.outerHTML = `${user_container.outerHTML} ${name_small_html}`;
                                                }
                                            }
                                        });
                                    }

                                    var list_item = document.getElementsByClassName("hlist avatar-cards");
                                    list_item = Array.prototype.slice.call(list_item);
                                    if (list_item.length > 0) {
                                        var catalog_list_header = list_item[0];
                                        var observer = new MutationObserver(applyAutoChangeFunctionB);
                                        observer.observe(catalog_list_header, { childList: true });
                                    }

                                    addPromptButtonInput()
                                }, 1000);
                            }

                            function applyAutoChangeFunctionD() {
                                setTimeout(function () {
                                    var username_containers_9 = document.getElementsByClassName("creator-name text-overflow text-link ng-binding");
                                    username_containers_9 = Array.prototype.slice.call(username_containers_9);
                                    if (username_containers_9.length > 0) {
                                        username_containers_9.forEach((user_container) => {
                                            if (user_container.outerHTML.includes(`@${json["name"]}`) && user_container.className == "creator-name text-overflow text-link ng-binding") {
                                                user_container.outerHTML = `${user_container.outerHTML} ${name_side_html}`;
                                            }
                                            if (include_groups == true) {
                                                if (user_container.className == "creator-name text-overflow text-link ng-binding") {
                                                    if (user_container.href && user_container.href.includes("/groups/")) {
                                                        var group_id = user_container.href.match(/[0-9]+/)[0];
                                                        var generated_group_api_link = `https://groups.roblox.com/v1/groups/${group_id}`;
                                                        if (allowed_groups[group_id] && allowed_groups[group_id]["accepted"] == true) {
                                                            if (user_container.className == "creator-name text-overflow text-link ng-binding") {
                                                                if (user_container.outerHTML.includes(allowed_groups[group_id]["name"])) {
                                                                    user_container.outerHTML = `${user_container.outerHTML} ${name_side_html}`;
                                                                }
                                                            }
                                                        } else {
                                                            fetch(generated_group_api_link).then(grou_res => { return grou_res.json(); }).then(grou_json => {
                                                                if (grou_json["owner"]) {
                                                                    if (grou_json["owner"]["userId"] == userId) {
                                                                        grou_json["accepted"] = true
                                                                        allowed_groups[group_id] = grou_json
                                                                        if (user_container.className == "creator-name text-overflow text-link ng-binding") {
                                                                            if (user_container.outerHTML.includes(grou_json["name"])) {
                                                                                user_container.outerHTML = `${user_container.outerHTML} ${name_side_html}`;
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            })
                                                        }
                                                    }
                                                }
                                            }
                                        });
                                    }

                                    var list_item = document.getElementById("assetsItems");
                                    if (list_item) {
                                        var catalog_list_header = list_item;
                                        var observer = new MutationObserver(applyAutoChangeFunctionD);
                                        observer.observe(catalog_list_header, { childList: true });
                                    }
                                }, 1000);
                            }

                            var username_containers_2 = document.getElementsByClassName("creator-name text-link");
                            username_containers_2 = Array.prototype.slice.call(username_containers_2);
                            if (username_containers_2.length > 0) {
                                username_containers_2.forEach((user_container) => {
                                    if (user_container.outerHTML.includes(`@${json["name"]}`) && user_container.className == "creator-name text-link") {
                                        user_container.outerHTML = `${user_container.outerHTML} ${name_side_html}`;
                                    }
                                    if (include_groups == true) {
                                        if (user_container.className == "creator-name text-link") {
                                            if (user_container.href && user_container.href.includes("/groups/")) {
                                                var group_id = user_container.href.match(/[0-9]+/)[0];
                                                var generated_group_api_link = `https://groups.roblox.com/v1/groups/${group_id}`;
                                                if (allowed_groups[group_id] && allowed_groups[group_id]["accepted"] == true) {
                                                    if (user_container.className == "creator-name text-link") {
                                                        if (user_container.outerHTML.includes(allowed_groups[group_id]["name"])) {
                                                            user_container.outerHTML = `${user_container.outerHTML} ${name_side_html}`;
                                                        }
                                                    }
                                                } else {
                                                    fetch(generated_group_api_link).then(grou_res => { return grou_res.json(); }).then(grou_json => {
                                                        if (grou_json["owner"]) {
                                                            if (grou_json["owner"]["userId"] == userId) {
                                                                grou_json["accepted"] = true
                                                                allowed_groups[group_id] = grou_json
                                                                if (user_container.className == "creator-name text-link") {
                                                                    if (user_container.outerHTML.includes(grou_json["name"])) {
                                                                        user_container.outerHTML = `${user_container.outerHTML} ${name_side_html}`;
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    })
                                                }
                                            }
                                        }
                                    }
                                });
                            }

                            var username_containers_3 = document.getElementsByClassName("text-name text-overflow");
                            username_containers_3 = Array.prototype.slice.call(username_containers_3);
                            if (username_containers_3.length > 0) {
                                username_containers_3.forEach((user_container) => {
                                    if (user_container.outerHTML.includes(`@${json["name"]}`)) {
                                        user_container.outerHTML = `${user_container.outerHTML}${game_html}`;
                                    }
                                    if (include_groups == true) {
                                        if (user_container.href && user_container.href.includes("/groups/")) {
                                            var group_id = user_container.href.match(/[0-9]+/)[0];
                                            var generated_group_api_link = `https://groups.roblox.com/v1/groups/${group_id}`;
                                            if (allowed_groups[group_id] && allowed_groups[group_id]["accepted"] == true) {
                                                if (user_container.outerHTML.includes(allowed_groups[group_id]["name"])) {
                                                    user_container.outerHTML = `${user_container.outerHTML}${game_html}`;
                                                }
                                            } else {
                                                fetch(generated_group_api_link).then(grou_res => { return grou_res.json(); }).then(grou_json => {
                                                    if (grou_json["owner"]) {
                                                        if (grou_json["owner"]["userId"] == userId) {
                                                            grou_json["accepted"] = true
                                                            allowed_groups[group_id] = grou_json
                                                            if (user_container.outerHTML.includes(grou_json["name"])) {
                                                                user_container.outerHTML = `${user_container.outerHTML}${game_html}`;
                                                            }
                                                        }
                                                    }
                                                })
                                            }
                                        }
                                    }
                                });
                            }

                            var username_containers_4 = document.getElementsByClassName("text-name");
                            username_containers_4 = Array.prototype.slice.call(username_containers_4);
                            if (username_containers_4.length > 0) {
                                username_containers_4.forEach((user_container) => {
                                    if (user_container.parentElement.outerHTML.includes(`@${json["name"]}`)) {
                                        user_container.parentElement.outerHTML = `${user_container.parentElement.outerHTML}${game_html}`;
                                    }
                                    if (include_groups == true) {
                                        if (user_container.href && user_container.href.includes("/groups/")) {
                                            var group_id = user_container.href.match(/[0-9]+/)[0];
                                            var generated_group_api_link = `https://groups.roblox.com/v1/groups/${group_id}`;
                                            if (allowed_groups[group_id] && allowed_groups[group_id]["accepted"] == true) {
                                                if (user_container.parentElement.outerHTML.includes(allowed_groups[group_id]["name"])) {
                                                    user_container.parentElement.outerHTML = `${user_container.parentElement.outerHTML}${game_html}`;
                                                }
                                            } else {
                                                fetch(generated_group_api_link).then(grou_res => { return grou_res.json(); }).then(grou_json => {
                                                    if (grou_json["owner"]) {
                                                        if (grou_json["owner"]["userId"] == userId) {
                                                            grou_json["accepted"] = true
                                                            allowed_groups[group_id] = grou_json
                                                            if (user_container.parentElement.outerHTML.includes(grou_json["name"])) {
                                                                user_container.parentElement.outerHTML = `${user_container.parentElement.outerHTML}${game_html}`;
                                                            }
                                                        }
                                                    }
                                                })
                                            }
                                        }
                                    }
                                });
                            }

                            var username_containers_5 = document.getElementsByClassName("text-overflow age-bracket-label-username font-caption-header");
                            username_containers_5 = Array.prototype.slice.call(username_containers_5);
                            if (username_containers_5.length > 0) {
                                username_containers_5.forEach((user_container) => {
                                    if (user_container.outerHTML.includes(`${json["displayName"]}`) && user_container.className == "text-overflow age-bracket-label-username font-caption-header") {
                                        user_container.outerHTML = `${user_container.outerHTML} ${name_side_html}`;
                                    }
                                });
                            }

                            var username_containers_6 = document.getElementsByClassName("text-name name ng-binding");
                            username_containers_6 = Array.prototype.slice.call(username_containers_6);
                            if (username_containers_6.length > 0) {
                                username_containers_6.forEach((user_container) => {
                                    if (user_container.outerHTML.includes(`${json["displayName"]}`) && user_container.className == "text-name name ng-binding") {
                                        user_container.outerHTML = `${user_container.outerHTML} ${name_side_html}`;
                                    }
                                });
                            }

                            var username_containers_7 = document.getElementsByClassName("avatar-name text-overflow ng-binding");
                            username_containers_7 = Array.prototype.slice.call(username_containers_7);
                            if (username_containers_7.length > 0) {
                                username_containers_7.forEach((user_container) => {
                                    if (user_container.outerHTML.includes(`${json["displayName"]}`) && user_container.className == "avatar-name text-overflow ng-binding") {
                                        if (user_container.parentElement.parentElement.children[1].outerHTML.includes(`@${json["name"]}`)) {
                                            user_container.outerHTML = `${user_container.outerHTML} ${name_small_html}`;
                                        }
                                    }
                                });
                            }

                            setTimeout(function () {
                                var username_containers_8 = document.getElementsByClassName("text-overflow avatar-name ng-binding ng-scope");
                                username_containers_8 = Array.prototype.slice.call(username_containers_8);
                                if (username_containers_8.length > 0) {
                                    username_containers_8.forEach((user_container) => {
                                        if (user_container.outerHTML.includes(`${json["displayName"]}`) && user_container.className == "text-overflow avatar-name ng-binding ng-scope") {
                                            var username_containers_9 = document.getElementsByClassName("text-overflow avatar-card-label ng-binding ng-scope");
                                            username_containers_9 = Array.prototype.slice.call(username_containers_9);
                                            if (username_containers_9.length > 0) {
                                                username_containers_9.forEach((user_container_2) => {
                                                    if (user_container.offsetParent == user_container_2.offsetParent) {
                                                        if (user_container_2.innerText == `@${json["name"]}`) {
                                                            user_container.outerHTML = `${user_container.outerHTML} ${game_html}`;
                                                        }
                                                    }
                                                });
                                            }
                                        }
                                    });
                                }
                            }, 1000);

                            setTimeout(function () {
                                var list_item = document.getElementsByClassName("search-result avatar-cards ng-scope");
                                list_item = Array.prototype.slice.call(list_item);
                                if (list_item.length > 0) {
                                    var catalog_list_header = list_item[0];
                                    var observer = new MutationObserver(applyAutoChangeFunctionB);
                                    observer.observe(catalog_list_header, { childList: true });
                                }
                            }, 1000);

                            var list_item = document.getElementsByClassName("hlist item-cards-stackable ng-scope");
                            list_item = Array.prototype.slice.call(list_item);
                            if (list_item.length > 0) {
                                var catalog_list_header = list_item[0];
                                var observer = new MutationObserver(applyAutoChangeFunctionB);
                                observer.observe(catalog_list_header, { childList: true });
                            }

                            var list_item = document.getElementsByClassName("tab-content configure-group-details");
                            list_item = Array.prototype.slice.call(list_item);
                            if (list_item.length > 0) {
                                var catalog_list_header = list_item[0];
                                var observer = new MutationObserver(applyAutoChangeFunctionC);
                                observer.observe(catalog_list_header, { childList: true });
                            }

                            var list_item = document.getElementsByClassName("hlist avatar-cards");
                            list_item = Array.prototype.slice.call(list_item);
                            if (list_item.length > 0) {
                                var catalog_list_header = list_item[0];
                                var observer = new MutationObserver(applyAutoChangeFunctionB);
                                observer.observe(catalog_list_header, { childList: true });
                            }

                            setTimeout(function () {
                                var list_item = document.getElementsByClassName("content");
                                list_item = Array.prototype.slice.call(list_item);
                                if (list_item.length > 0) {
                                    var catalog_list_header = list_item[0];
                                    var observer = new MutationObserver(applyAutoChangeFunctionB);
                                    observer.observe(catalog_list_header, { childList: true });
                                }
                            }, 1000);

                            setTimeout(addPromptButtonInput, 1000)

                            window.set_verified = true
                        } else {
                            if (allow_messages) alert("Fake Verified Badge couldn't be applied since we couldn't figure what your User ID is.");
                        }
                    }).catch(err => {
                        console.error(err.message);
                        if (allow_messages) alert("We couldn't apply the verified badge due to an error! Sorry!");
                    })
            }
        }
    }, 1000)
}
