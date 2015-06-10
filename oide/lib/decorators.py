import functools
import urlparse
import os
import pwd
from urllib import urlencode



def authenticated(method):
    @functools.wraps(method)
    def wrapper(self, *args, **kwargs):
        exec_user = pwd.getpwuid(os.getuid())[0]
        if (not self.current_user) or (self.current_user != exec_user):
            if self.request.method in ("GET", "HEAD"):
                url = self.get_login_url()
                if "?" not in url:
                    if urlparse.urlsplit(url).scheme:
                        # if login url is absolute, make next absolute too
                        next_url = self.request.full_url()
                    else:
                        next_url = self.request.uri
                    url += "?" + urlencode(dict(next=next_url))
                self.redirect(url)
                return
            raise HTTPError(403)
        return method(self, *args, **kwargs)
    return wrapper
