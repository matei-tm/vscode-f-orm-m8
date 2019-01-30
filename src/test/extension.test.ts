//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
import * as assert from 'assert';
import { Utils } from '../utils/utils';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// import * as vscode from 'vscode';
// import * as myExtension from '../extension';

// Defines a Mocha test suite to group tests of similar kind together
suite("Extension Tests", function () {

    //Unit tests for Utils class methods
    test("getUnderscoreCase from PascalCase with digits", function () {
        assert.equal(Utils.getUnderscoreCase("New01Model"), "new01_model");
    });
    test("getUnderscoreCase from PascalCase without digits", function () {
        assert.equal(Utils.getUnderscoreCase("NewModel"), "new_model");
    });
    test("getUnderscoreCasePlural from PascalCase with digits", function () {
        assert.equal(Utils.getUnderscoreCasePlural("New01Model"), "new01_models");
    });
    test("getUnderscoreCasePlural from PascalCase without digits", function () {
        assert.equal(Utils.getUnderscoreCasePlural("NewModel"), "new_models");
    });
});
