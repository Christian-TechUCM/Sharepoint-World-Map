'use strict';

const build = require('@microsoft/sp-build-web');
const {task} = require('gulp');
const del = require('del');

async function clean() {
  console.log('processing ... clean');

  return del([__dirname + '/dist']);
}

task(clean)

build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

var getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  var result = getTasks.call(build.rig);

  result.set('serve', result.get('serve-deprecated'));

  return result;
};

build.initialize(require('gulp'));
