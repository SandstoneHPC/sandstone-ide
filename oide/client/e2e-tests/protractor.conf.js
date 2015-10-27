var env = require('./environment.js');

exports.config = {
  allScriptsTimeout: 11000,

  seleniumAddress: env.seleniumAddress,

  specs: [
    '*.js'
  ],

  capabilities: {
    'browserName': 'chrome'
  },

  baseUrl: env.baseUrl,

  framework: 'jasmine2',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  },
  
  params: {
    login: {
      username: env.creds.username,
      password: env.creds.password
    }
  },
  
  onPrepare: function() {
    browser.driver.get(env.baseUrl+'/auth/login?next=%2F#/editor');
    browser.driver.findElement(by.css('input[name=username]')).sendKeys(env.creds.username);
    browser.driver.findElement(by.css('input[name=password]')).sendKeys(env.creds.password);
    browser.driver.findElement(by.css('.form-signin > button')).click();
    
    return browser.driver.wait(function() {
      return browser.driver.getCurrentUrl().then(function(url) {
        return /editor/.test(url);
      });
    }, 10000, "URL hasn't changed.");
  }
};
