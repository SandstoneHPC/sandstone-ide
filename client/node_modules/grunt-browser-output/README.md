# grunt-browser-output

> Show grunt errors in a popup window in your browser.

This plugin will mirror the Grunt console output in a browser window when a plugin
shows warnings or errors. The motivation is to avoid having to toggle back to a terminal window to see errors
(ex. JSHint warnings) during a grunt/watch/livereload session.

![](screenshot.png)

Only works in modern browsers with WebSocket support.

## Getting Started

```shell
npm install grunt-browser-output --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-browser-output');
```

**Important: Using this plugin with `grunt-contrib-watch` and `livereload` requires `grunt-contrib-watch` version `0.6.0` or higher and you must configure [livereloadOnError = false](https://github.com/gruntjs/grunt-contrib-watch#optionslivereloadonerror).**

## The "browser_output" task

### Overview
In your project's Gruntfile, add a section named `browser_output` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  browser_output: {
    //no options currently, just need the empty target
  },
})
```

Add `browser_output` before your `watch` task.

```js
grunt.registerTask('serve', ['browser_output','connect', 'watch']);
```

Finally, add the following script tag to your web page:
```html
<script src="node_modules/grunt-browser-output/client.js"></script>
```

## Release History
 - 3/13/2014 - v0.1.0 - Initial release.
