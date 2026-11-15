#!/usr/bin/env python3
"""Preview the GitHub Pages build like Pages serves it: /foo -> foo.html, /foo/ -> foo/index.html.
  npm run build:pages && python3 scripts/serve-static.py   # http://localhost:5180
"""
import http.server, os, sys

ROOT = os.path.join(os.path.dirname(__file__), "..", "dist", "client")


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def send_head(self):
        path = self.path.split("?", 1)[0].split("#", 1)[0]
        local = os.path.join(ROOT, path.lstrip("/"))
        if path != "/" and not os.path.exists(local) and os.path.exists(local + ".html"):
            self.path = path + ".html" + self.path[len(path):]
        elif not os.path.exists(local) and not os.path.exists(local + ".html"):
            self.path = "/404.html"
        return super().send_head()


port = int(sys.argv[1]) if len(sys.argv) > 1 else 5180
http.server.ThreadingHTTPServer(("127.0.0.1", port), Handler).serve_forever()
