import ma = require('vsts-task-lib/mock-answer');
import tmrm = require('vsts-task-lib/mock-run');
import path = require('path');
import util = require('../NugetMockHelper');

let taskPath = path.join(__dirname, '../..', 'nugetcommandmain.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);
let nmh: util.NugetMockHelper = new util.NugetMockHelper(tmr);

nmh.setNugetVersionInputDefault();
tmr.setInput('command', 'push');
tmr.setInput('searchPatternPush', 'foo.nupkg');
tmr.setInput('nuGetFeedType', 'internal');
tmr.setInput('feedPublish', 'FeedFooId');
tmr.setInput('allowPackageConflicts', 'false');

let a: ma.TaskLibAnswers = <ma.TaskLibAnswers>{
    "osType": {},
    "checkPath": {
        "c:\\agent\\home\\directory\\foo.nupkg": true
    },
    "which": {},
    "exec": {
        "c:\\agent\\home\\directory\\externals\\nuget\\VstsNuGetPush.exe c:\\agent\\home\\directory\\foo.nupkg -Source foobar -AccessToken token -NonInteractive": {
            "code": 0,
            "stdout": "VstsNuGetPush output here",
            "stderr": ""
        }
    },
    "exist": {},
    "stats": {
        "c:\\agent\\home\\directory\\foo.nupkg": {
            "isFile": true
        }
    }, 
    "findMatch": {
        "foo.nupkg" : ["c:\\agent\\home\\directory\\foo.nupkg"]
    }
};
nmh.setAnswers(a);

process.env["NuGet_ForceVstsNuGetPushForPush"] = "true";
nmh.registerNugetUtilityMock(["c:\\agent\\home\\directory\\foo.nupkg"]);
nmh.registerDefaultNugetVersionMock();
nmh.registerToolRunnerMock();
nmh.registerNugetConfigMock();
nmh.RegisterLocationServiceMocks();
nmh.registerVstsNuGetPushRunnerMock();

tmr.run();
