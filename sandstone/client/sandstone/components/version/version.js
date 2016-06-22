'use strict';

angular.module('sandstone.version', [
  'sandstone.version.interpolate-filter',
  'sandstone.version.version-directive'
])

.value('version', '0.1');
