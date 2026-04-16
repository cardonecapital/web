import http.server, os

os.chdir(os.path.dirname(os.path.abspath(__file__)))

class Handler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        if path.startswith('/web'):
            path = path[4:] or '/'
        return super().translate_path(path)
    def log_message(self, format, *args):
        pass  # suppress log noise

print("Server running at http://localhost:8081/web/")
http.server.HTTPServer(('', 8081), Handler).serve_forever()
