'use strict';

angular.module('oide.version', [
  'oide.version.interpolate-filter',
  'oide.version.version-directive'
])

.value('version', '0.1');
