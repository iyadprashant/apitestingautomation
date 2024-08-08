const logs = {
    messages: []
}



var url = "/api/v1/pschat";
var psChatEndpointForLocalUseOnly = "https://dev-api.sunbeltrentals.com/sbr-dev-pschat-poc-sapi-v1/api/v1";


function activateOAS() {
    $(".section").hide();
    $(".oassection").show();
}

function activateTDG() {
    var tdd = document.getElementById("testdatasection");
    var oas = document.getElementById("oassection");

    tdd.setAttribute("style", 'display:block;')
    oas.setAttribute("style", 'display:none;')
}

function generateMissingKeyTestData() {
    var apispecjsoninput = document.getElementById('apispecjsoninput').value;
    var apispecjsonmandkeys = document.getElementById('apispecjsonmandkeys').value;
    var reqJSON = JSON.parse(apispecjsoninput);

    const result = createMissingRequiredKeyCopies(reqJSON, apispecjsonmandkeys.split(","));
    console.log(result);

    downloadAsFile("missingKeysDataSet.json", JSON.stringify(result, null, "\t"));
}

function generateEmptyValueTestData() {
    var apispecjsoninput = document.getElementById('apispecjsoninput').value;
    var apispecjsonmandkeys = document.getElementById('apispecjsonmandkeys').value;
    var reqJSON = JSON.parse(apispecjsoninput);

    const result = createEmptyOrNullValueCopies(reqJSON, apispecjsonmandkeys.split(","));
    console.log(result);

    downloadAsFile("EmptyValueDataSet.json", JSON.stringify(result, null, "\t"));
}

function generateInvalidValueTestData() {
    var apispecjsoninput = document.getElementById('apispecjsoninput').value;
    var apispecjsonmandkeys = document.getElementById('apispecjsonmandkeys').value;
    var reqJSON = JSON.parse(apispecjsoninput);

    const result = createInvalidValueTypeCopies(reqJSON, apispecjsonmandkeys.split(","));
    console.log(result);

    downloadAsFile("InvalidValueDataSet.json", JSON.stringify(result, null, "\t"));
}



function loadAPISpecJsonKeys() {

    var apispecjsoninput = document.getElementById('apispecjsoninput').value;
    var apispecjsonmandkeys = document.getElementById('apispecjsonmandkeys').value;

    var reqJSON = JSON.parse(apispecjsoninput);
    const keys = getAllKeys(reqJSON);
    document.getElementById('apispecjsonmandkeys').value = keys.join(",");


}

function preventInvalidJSON(text, message) {
    try {
        var rs = JSON.parse(text);
        return rs;
    } catch (e) {
        alert("Invalid JSON. " + message + "\n" + e);
        throw new Error(e);
    }
}

function retrieveInputs() {

    addLogLine("Gathering Input From UI");
    var response = document.getElementById('response').value;
    var request = document.getElementById('request').value;
    var headers = document.getElementById('headers').value;
    var responseMandKeys = document.getElementById('responsemandkeys').value;
    var requestMandKeys = document.getElementById('requestmandkeys').value;
    var headersMandKeys = document.getElementById('headersmandkeys').value;
    var path = document.getElementById('respath').value;
    var resname = document.getElementById('resname').value;
    var resmethod = $("#resmethod").val();
    resmethod = resmethod.toLowerCase();
    resname = resname.toLowerCase();


    console.log(requestMandKeys, responseMandKeys, headersMandKeys);

    var inputraw = {
        name: resname,
        path: path,
        method: resmethod,
        request: {
            content: request,
            mandkeys: requestMandKeys
        },
        response: {
            content: response,
            mandkeys: responseMandKeys
        },
        headers: {
            content: headers,
            mandkeys: headersMandKeys,
            type: typeof(headersMandKeys)
        },
        errorcodes: [200, 400, 600],
        accessToken: ""
    }


    console.log(inputraw);

    preventInvalidJSON(request, "Request doesn't have valid JSON. Please correct it and try again.");
    preventInvalidJSON(response, "Response doesn't have valid JSON. Please correct it and try again.");

    const fPrefix = resname + resmethod;

    const requestConfig = {
        content: JSON.parse(request),
        mandkeys: requestMandKeys.split(","),
        filenames: {
            "oas": fPrefix + "ReqbodyOas.yaml",
            "common": fPrefix + "ReqbodyCommon.yaml",
            "body": fPrefix + "Reqbody.yaml"
        },
        filepaths: {}
    }

    requestConfig.filepaths[requestConfig.filenames.oas] = "";
    requestConfig.filepaths[requestConfig.filenames.common] = "/libraries";
    requestConfig.filepaths[requestConfig.filenames.body] = "/schemas/request";

    //--------------------------------------------------------------------------

    const responseConfig = {
        content: JSON.parse(response),
        mandkeys: responseMandKeys.split(","),
        filenames: {
            "oas": fPrefix + "RespbodyOas.yaml",
            "common": fPrefix + "RespbodyCommon.yaml",
            "body": fPrefix + "Respbody.yaml"
        },
        filepaths: {}

    }


    responseConfig.filepaths[responseConfig.filenames.oas] = "";
    responseConfig.filepaths[responseConfig.filenames.common] = "/libraries";
    responseConfig.filepaths[responseConfig.filenames.body] = "/schemas/response";

    //--------------------------------------------------------------------------

    const headersConfig = {
        content: headers.split("\n"),
        mandkeys: headersMandKeys.split(","),
        filenames: {
            "oas": fPrefix + "HeadersOas.yaml",
            "common": fPrefix + "HeadersCommon.yaml"
        },
        filepaths: {}

    }


    headersConfig.filepaths[headersConfig.filenames.oas] = "";
    headersConfig.filepaths[headersConfig.filenames.common] = "/libraries";


    var input = {
        name: resname,
        path: path,
        method: resmethod,
        request: {
            content: JSON.parse(request),
            mandkeys: requestMandKeys.split(","),
            filenames: {
                "oas": fPrefix + "reqbody_oas.yaml",
                "common": fPrefix + "reqbody_common.yaml",
                "body": fPrefix + "reqbody.yaml"
            },
            filepaths: {
                "oas": "",
                "common": "/libraries",
                "body": "/schemas/request"
            }

        },
        response: {
            content: JSON.parse(response),
            mandkeys: responseMandKeys.split(","),
            filenames: {
                "oas": fPrefix + "respbody_oas.yaml",
                "common": fPrefix + "respbody_common.yaml",
                "body": fPrefix + "respbody.yaml"
            },
            filepaths: {
                "oas": "",
                "common": "/libraries",
                "body": "/schemas/response"
            }

        },
        headers: {
            content: headers.split("\n"),
            mandkeys: headersMandKeys.split(","),
            filenames: {
                "oas": fPrefix + "headers_oas.yaml",
                "common": fPrefix + "headers_common.yaml"
            },
            filepaths: {
                "oas": "",
                "common": "/libraries"
            }

        },
        errorcodes: [200, 400, 600],
        accessToken: ""
    }
    input.request = requestConfig;
    input.response = responseConfig;
    input.headers = headersConfig;

    console.log(input);

    return input;
}

function downloadCode() {

    clearLogs();
    invokePSChatForOASGeneration();

}

function invokePSChatForOASGeneration() {

    if (accessToken === null || accessToken === undefined || accessToken === "") {
        alert("Please set access token first!");
        return;
    }

    console.log("Gathering Input from UI:");
    const input = retrieveInputs();
    console.log(input);

    console.log("Creating API request for prompts:")
    var request = getPSChatRequestPayload(input);
    console.log(request);
    addLogLine("Request For PS Chat API Prepared");


    insertPrompts([
            "Generate Headers Using Below Prompt",
            "Generate Request Body Using Below Prompt",
            "Generate 200 Response Body Using Below Prompt",
            "Generate Error Responses Using Below Prompt",
        ],
        request.prompts);


    callPSChatWrapperAPIWithPrompts(request, function(response) {

        addLogLine("API Responded");

        console.log("callback executed after getting the response.");

        const pschat = response; //getResponse();

        const errors = [];

        if (pschat[0].response.error) {
            errors.push({
                message: "Unable to generate the HEADERS OAS through PSChat.",
                error: pschat[0].response.error
            });
            addLogLine("Unable to generate the HEADERS OAS through PSChat.");

        } else {
            addLogLine("HEADERS OAS Generated through PSChat. Parsing Response");

            const headersCode = extractCode(pschat[0].response, [
                "commonHeaders.yaml",
                input.name + "_OAS.yaml"
            ]);

            console.log("headers code sections");
            console.log(headersCode);
            addLogLine("Parsed Successfully. Downloading Files.");

            downloadAllFiles(headersCode, input.name + "_Headers_OAS.yaml");

        }


        if (pschat[1].response.error) {
            errors.push({
                message: "Unable to generate the REQUEST BODY OAS through PSChat.",
                error: pschat[1].response.error
            });
            addLogLine("Unable to generate the Request Body OAS through PSChat.");

        } else {
            addLogLine("Request Body OAS Generated through PSChat. Parsing Response");

            const requestCode = extractCode(pschat[1].response, [
                "common.yaml",
                input.name + "Request.yaml",
                input.name + "_OAS.yaml"
            ]);
            addLogLine("Parsed Successfully. Downloading Files.");

            console.log("request code sections");
            console.log(requestCode);
            downloadAllFiles(requestCode, input.name + "_Request_OAS.yaml");

        }



        if (pschat[2].response.error) {
            errors.push({
                message: "Unable to generate the 200 RESPONSE BODY OAS through PSChat.",
                error: pschat[2].response.error
            });
            addLogLine("Unable to generate the 200 Response OAS through PSChat.");

        } else {
            addLogLine("200 Response OAS Generated through PSChat. Parsing Response");

            const responseCode = extractCode(pschat[2].response, [
                "common.yaml",
                input.name + "Response200.yaml",
                input.name + "_OAS.yaml"
            ]);
            console.log("200 response code sections");
            console.log(responseCode);
            downloadAllFiles(responseCode, input.name + "_Response_OAS.yaml");

        }

        if (pschat[3].response.error) {
            errors.push({
                message: "Unable to generate the All ERROR RESPONSES OAS through PSChat.",
                error: pschat[3].response.error
            });
            addLogLine("Unable to generate the Error Responses OAS through PSChat.");

        } else {
            addLogLine("Error Responses OAS Generated through PSChat. Parsing Response");

        }


        if (errors.length > 0) {

            addLogLine("PS Chat API errored");

            addLogLine("API Responded with partial Success");

            var message = "";

            errors.map((item) => {
                message += "\n" + item.message;
            })

            console.log("All Errors======", errors);
            alert(message);
        } else {
            addLogLine("API Responded Successfully");

        }




        console.log("Trying to download all the files..");


    })

}

function generatePrompts() {

    popupPrompts();

    const input = retrieveInputs();
    var prompts = getAPIResourcePrompts(input);

    insertPrompts(prompts.requestbody, $("#reqbodyprompttext .promptbody")[0]);
    insertPrompts(prompts.responsebody, $("#respbodyprompttext .promptbody")[0]);
    insertPrompts(prompts.headers, $("#headerprompttext .promptbody")[0]);

}

function insertPrompts(prompt, parentDivRef) {

    var prp = document.createElement("p");
    prp.appendChild(document.createTextNode(prompt));
    parentDivRef.appendChild(prp);

}

function getAPIResourcePrompts(input) {

    function getChatGptPromptForHeaders(resname, path, method, headerlist, headerscardinality, files) {

        const headersPrompt = `Create a OAS file.
    Add a ` + method + ` api resource with the path ` + path + `.
    API resource name is "` + resname + `".
    Whatever code files you generate, put the file name as comment on the first line.
    For the oas file put the file name as ` + files.oas + `.
    Add the headers ` + headerlist.join(",") + `.
    For all these headers create a schema in file "commonHeaders.yaml" at "/libraries".
    In this schema for all the keys add the data type, name, in, nullable, description and example for every element in "commonHeaders.yaml" file only.
    In the main OAS file refer all the elements separately instead of referring the whole "commonHeaders.yaml" file.
    Put the schema keyword in the "commonHeaders.yaml" file itself. Just use ref for every element in the main oas file.
    In the main OAS file refer all the elements separately.
    Required headeres are ` + headerscardinality.join(" , ") + `
    `;


        return removeNLines(headersPrompt);

    }

    function getChatGptPromptForRequest(resname, path, method, reqbodyjson, mandatorykeys, files) {

        var prompt = "";

        const requestbodyPrompt1 = `Create a OAS file.
    Add a ` + method + ` api resource with the path ` + path + `.
    API resource name is "` + resname + `".
    Whatever code files you generate, put the file name as comment on the first line.
    For the oas file put the file name as ` + files.oas + `.
    Add the below JSON as the JSON request body.`

        prompt += removeNLines(requestbodyPrompt1);
        prompt += "   " + JSON.stringify(reqbodyjson) + " .   ";

        const requestbodyPrompt2 = `For the request body create a schema in file "` + files.body + `" at "schemas/request".
    Write the description and the content in this file only.
    While writing the schema externalize all the JSON keys that has value of type string, boolean or number only in a file by the name "common.yaml" at "/libraries".
    Don't externalize the type information but the whole key. For arrays add minItems attribute in the schema.
    Keys ` + mandatorykeys.join(" , ") + ` are are mandatory. Add attributes description and example as well.`;

        prompt += removeNLines(requestbodyPrompt2);
        prompt += '. Create the common.yaml, ' + files.body + ' and oas file.'

        return prompt;
    }

    function getChatGptPromptForResponse(resname, path, method, respbodyjson, mandatorykeys, files) {

        const responsebodyPrompt = `
    Create a OAS file.
    Add an ` + method + ` api resource with the path ` + path + `.
    API resource name is "` + resname + `".
    Whatever code files you generate, put the file name as comment on the first line.
    For the oas file put the file name as ` + files.oas + `.

    Add the below JSON as the JSON response body for http status code 200.
    For the response body create a schema file "` + files.body + `" at path "/schemas/response".
    Write the description and the content in this file only.
    While writing the schema externalize all the JSON keys that has value of type string, Boolean or number in the file by the name "` + files.common + `" at path "/libraries".
    Don't externalize the type information but the whole key. For arrays add minItems attribute in the schema.
    Keys ` + mandatorykeys.join(" , ") + ` are are mandatory. Add attributes description and example as well.`;

        var prompt = removeNLines(responsebodyPrompt);
        prompt += "   " + JSON.stringify(respbodyjson);
        prompt += '.    Create the ' + files.common + ', ' + files.body + ' and oas file.'

        return prompt;


    }

    function getChatGptPromptForErrorResponses(resname, path, errorCodes) {

        const responseErrorPrompt = `
    Create a OAS file.
    Add an POST api resource with the path ` + path + `.
    API resource name is "` + resname + `".
    Whatever code files you generate, put the file name as comment on the first line.
    For the oas file put the file name as ` + resname + `_OAS.yaml.

    Create the response for http status code type ` + errorCodes.join(",") + `.
    For response content refer to the schema. Don't put description or content or schema but just the ref.
    The schema for these response code has been created in a file by the name errors.yaml at path "/libraries".



    `

        return responseErrorPrompt;

    }


    return {
        headers: getChatGptPromptForHeaders(input.name, input.path, input.method, input.headers.content, input.headers.mandkeys, input.headers.filenames),
        requestbody: getChatGptPromptForRequest(input.name, input.path, input.method, input.request.content, input.request.mandkeys, input.request.filenames),
        responsebody: getChatGptPromptForResponse(input.name, input.path, input.method, input.response.content, input.response.mandkeys, input.response.filenames)

    }

}

function downloadAllFiles(xcodes, oasFileOverrideName) {
    for (var i = 0; i < xcodes.length; i++) {
        var xcode = xcodes[i];
        downloadCodeSection(xcode.lines, xcode.filename);
    }
}

function downloadAsFile(filename, content) {
    // Create element with <a> tag
    const link = document.createElement("a");

    // Create a blog object with the file content which you want to add to the file
    const file = new Blob([content], {
        type: 'text/plain'
    });

    // Add file content in the object URL
    link.href = URL.createObjectURL(file);

    // Add file name
    link.download = filename;

    // Add click event to <a> tag to save file.
    link.click();
    URL.revokeObjectURL(link.href);
}

function downloadBlob(filename, blob) {
    // Create element with <a> tag
    const link = document.createElement("a");

    // Create a blog object with the file content which you want to add to the file
    const file = blob;

    // Add file content in the object URL
    link.href = URL.createObjectURL(file);

    // Add file name
    link.download = filename;

    // Add click event to <a> tag to save file.
    link.click();
    URL.revokeObjectURL(link.href);
}

function downloadCodeSection(lines, filename) {

    var content = "";

    downloadAsFile(filename, lines.join("\n"));

}

function extractCode(output, possibleFileNames) {

    var actualOutput = null;

    for (var i = 0; i < output.data.messages.length; i++) {
        var msg = output.data.messages[i];
        if (msg.role === "assistant") {
            actualOutput = msg.content;
        }
    }



    var lines = actualOutput.split("\n");

    const response = [];
    const allcodes = [];
    var inCodeSection = false;
    var code = {
        lang: "",
        lines: []
    }

    for (var i = 0; i < lines.length; i++) {

        var line = lines[i];


        if (line.indexOf("```") >= 0 && line.trim().startsWith("```")) {

            if (inCodeSection) {
                response.push(code);
                allcodes.push(code);
                //downloadCodeSection(code.lines, "file"+i+".yaml" );
                inCodeSection = false;
                continue;
            }

            inCodeSection = true;
            code = {
                lang: "",
                lines: []
            }

            code.lang = line.substring(3);
            continue;
        } else {
            if (inCodeSection) {
                code.lines.push(line)

            } else {
                response.push(line);

            }
        }
    }

    console.log(response);

    console.log(allcodes);
    for (var z = 0; z < allcodes.length; z++) {
        var xcode = allcodes[z];
        var fline = xcode.lines[0];
        var filename = null;

        for (var c = 0; c < possibleFileNames.length; c++) {

            if (fline !== null && fline !== undefined) {

                var rs = fline.toLowerCase().indexOf(possibleFileNames[c].toLowerCase());

                if (rs >= 0) {
                    filename = possibleFileNames[c];
                    console.log("filename found ", filename);

                    console.log(xcode);
                    break;

                }
            }
        }

        xcode.filename = filename === null ? "codesection_" + z : filename;


    }

    console.log(allcodes);

    return allcodes;

}

function getPSChatRequestPayload(input) {

    addLogLine("Preparing Request For PS Chat API")

    return {
        "model": "gpt4",
        "assistant": "You are a helpful AI assistant. If you do not know the answer to a question, respond by saying \"I do not know the answer to your question.\". Act as a senior software engineer.\nRespond in markdown format when possible.code parts should start with ```langauge and end with ``` . if asked for uml generate mermaid code and start the mermaid code with ```mermaid .",
        "role": "assistant",
        "parameters": {
            "temperature": 0,
            "max_tokens": 4000
        },
        "prompts": [
            getChatGptPromptForHeaders(input.name, input.path, input.method, input.headers.content, input.headers.mandkeys, input.headers.filenames),
            getChatGptPromptForRequest(input.name, input.path, input.method, input.request.content, input.request.mandkeys, input.request.filenames),
            getChatGptPromptForResponse(input.name, input.path, input.method, input.response.content, input.response.mandkeys, input.response.filenames),
        ]


    };


}




//---------------DIALOG----POPUP---------------------------------------------

function popupLogs() {
    $("#logs").addClass("popup");
}

function closeLogPopup() {
    clearLogs();
    $("#logs").removeClass("popup");

}

function popupPrompts() {
    clearPrompts();
    $("#prompts").addClass("popup");
}

function clearPrompts() {
    $("#reqbodyprompttext .promptbody").children().remove();
    $("#respbodyprompttext .promptbody").children().remove();
    $("#headerprompttext .promptbody").children().remove();

}
function closePrompts() {
    clearPrompts();
    $("#prompts").removeClass("popup");

}

function showDesignCenter() {
    $(".designcenter").show();
}

function hideDesignCenter() {
    $(".designcenter").hide();
}

//----------------------------------------------------------------------------

function removeNLines(mlprompt) {
    var prompt = mlprompt.split("\n");
    var promptstr = "";
    prompt.map((item) => {
        if (item !== "") {
            promptstr += "  " + item;
        }
    })
    return promptstr;
}



function invokePrompt(prompt, successCallback, errorCallback) {

    var myHeaders = {};
    myHeaders["Content-Type"] = "application/json";
    myHeaders["x-correlationId"] = "pschatutil_";
    myHeaders["Authorization"] = "Bearer " + accessToken;

    const bodycontent = {
        "model": "gpt4",
        "assistant": "You are a helpful AI assistant. If you do not know the answer to a question, respond by saying \"I do not know the answer to your question.\". Act as a senior software engineer.\nRespond in markdown format when possible.code parts should start with ```langauge and end with ``` . if asked for uml generate mermaid code and start the mermaid code with ```mermaid .",
        "role": "assistant",
        "parameters": {
            "temperature": 0,
            "max_tokens": 4000
        },
        "prompts": prompt
    };
    console.log(bodycontent);

    var raw = JSON.stringify(bodycontent);

    addLogLine("Request Sent...");

    fetch("/sbr-dev-pschat-poc-sapi-v1/api/v1/pschat", {
            method: 'POST',
            body: raw,
            headers: myHeaders
        })
        .then(response => response.text())
        .then(result => {

            addLogLine("Response Recieved. Processing...");
            console.log("response:", result);
            successCallback(result);

        })
        .catch(
            error => {
                addLogLine("Response Recieved. PSChat Unavailable . Please try after some time. C-GPTRRERR")
                console.log('Prompt Invoke Failed', error)
            }

        );


}


function invokePrompt(prompt, accessToken, successCallback, errorCallback) {

    var myHeaders = {};
    myHeaders["Content-Type"] = "application/json";
    myHeaders["originalauth"] = accessToken;
    myHeaders["x-correlationId"] = "pschatutil_";

    const bodycontent = {
        "model": "gpt4",
        "assistant": "You are a helpful AI assistant. If you do not know the answer to a question, respond by saying \"I do not know the answer to your question.\". Act as a senior software engineer.\nRespond in markdown format when possible.code parts should start with ```langauge and end with ``` . if asked for uml generate mermaid code and start the mermaid code with ```mermaid .",
        "role": "assistant",
        "parameters": {
            "temperature": 0,
            "max_tokens": 4000
        },
        "prompts": prompt
    };
    console.log(bodycontent);
    var raw = JSON.stringify(bodycontent);

    var requestconfig = {
        endpoint: "https://dev-api.sunbeltrentals.com/sbr-dev-pschat-poc-sapi-v1/api/v1/pschat",
        method: 'POST',
        headers: myHeaders,
        body: raw,
        uriparams: {},
        params: {}
    };


    var proxyHeaders = new Headers();
    proxyHeaders.append("Content-Type", "application/json");

    addLogLine("Request Sent...");

    fetch("http://localhost:8084/checkapiresource", {
            method: 'POST',
            body: JSON.stringify(requestconfig),
            headers: proxyHeaders
        })
        .then(response => response.text())
        .then(result => {

            addLogLine("Response Recieved. Processing...");
            console.log("response:", result);
            successCallback(result);

        })
        .catch(
            error => {
                addLogLine("Response Recieved. PSChat Unavailable . Please try after some time. C-GPTRRERR")
                console.log('Prompt Invoke Failed', error)
            }

        );


}


function callPSChatWrapperAPIWithPrompts(requestbody, callback) {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + accessToken);

    const body = JSON.stringify(requestbody);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: body,
        redirect: 'follow'
    };


    addLogLine("Request Sent. WAITING for response........", ["waitresponse"]);


    fetch(url, requestOptions)
        .then(response => response.text())
        .then(result => {
            try {
                var json = JSON.parse(result);
                console.log(json);
                callback(json);
            } catch (e) {
                console.log("response returned: ", result);
                console.log("PS Chat errored. Returned Invalid Response. Unable to Parse to JSON", e);
                alert("PS Chat errored. Returned Invalid Response. Unable to Parse to JSON");
                addLogLine("PS Chat errored. Returned Invalid Response. Unable to Parse to JSON", ["waitresponse"]);

                console.log(result);
            }

        })
        .catch(
            error => {
                console.log('error----', error)
            }

        );


}



//---------------------

function clearLogs() {
    var logsinner = $("#loginner").eq(0);
    logsinner.children().remove();

    $("")

}

function addLogLine(text, classes) {

    var parent = document.getElementById("loginner");
    var div = document.createElement("div");
    div.setAttribute("class", "logline");
    div.appendChild(document.createTextNode(text))
    if (classes) {
        var clsstring = "";
        classes.map((item) => {
            clsstring += item + " "
        });
        div.setAttribute("class", "logline " + clsstring);

    }
    parent.appendChild(div);

}

function addEmptyDiv(parent) {
    parent.appendChild(

    )
}

//------------------------------------------------------------------------------

function loadRequestKeys() {

    var request = document.getElementById('request').value;
    var reqJSON = JSON.parse(request);
    const keys = getAllKeys(reqJSON);
    document.getElementById('requestmandkeys').value = keys.join(",");
}

function loadResponseKeys() {
    var response = document.getElementById('response').value;
    var reqJSON = JSON.parse(response);
    const keys = getAllKeys(reqJSON);
    document.getElementById('responsemandkeys').value = keys.join(",");
}

function loadHeadersKeys() {

    var headers = document.getElementById('headers').value;
    const keys = headers.split("\n");
    document.getElementById('headersmandkeys').value = keys.join(",");

}


function activatePSChatPrompts(){

  $(".section").hide();
  $(".section.pschatpromopt").show();

}



function ChatGPTUI() {

    var accessToken = null;

    var lastPSChatCallSuccessful = false;
    var psChatCallInProgress = false;
    var projectsList = [];
    var branchesList = [];
    var activeBranch = null;
    var activeProject = null;
    var pushToDesignCenterInProgress = false;

    var codefragment = null;


    function ChatGPT() {
        //get data from localstorage:

        if (localStorage.getItem("pschatuser")) {
            accessToken = localStorage.getItem("pschatuser");
        }

        if (localStorage.getItem("oasconfig")) {
            const inputsstring = localStorage.getItem("oasconfig");

            const input = JSON.parse(inputsstring);

            var request = document.getElementById('request');
            var response = document.getElementById('response');
            var headers = document.getElementById('headers');
            var responseMandKeys = document.getElementById('responsemandkeys');
            var requestMandKeys = document.getElementById('requestmandkeys');
            var headersMandKeys = document.getElementById('headersmandkeys');
            var path = document.getElementById('respath');
            var resname = document.getElementById('resname');

            request.value = formatJSON(input.request.content);
            requestMandKeys.value = input.request.mandkeys.join(",");
            response.value = formatJSON(input.response.content);
            responseMandKeys.value = input.response.mandkeys.join(",");
            headers.value = input.headers.content.join("\n");
            headersMandKeys.value = input.headers.mandkeys.join(",");

            $("#apispecjsoninput").val(formatJSON(input.request.content));
            $("#apispecjsonmandkeys").val(input.request.mandkeys.join(","));

            path.value = input.path;
            resname.value = input.name;

        }
    }

    function formatJSON(str){
      return JSON.stringify(str, null, " ");
    }

    ChatGPT.prototype.bindControls = function() {

        $("#mulestarter").on("click", function(e){

          generateProject();
        });

        $("#appmenu span").on("click", function(e){

            switchTab($(e.target).text());

        });

        $("#addAccessToken").on("click", function(e) {

            accessToken = prompt("Provide the bearer token for PS Chat", "");
            localStorage.setItem("pschatuser", accessToken);

        });

        $("#savelocaldevice").on("click", function(e) {
            console.log("saving to local storage:");
            var input = retrieveInputs();
            const payload = JSON.stringify(input);
            localStorage.setItem("oasconfig", payload);
        })

        $("#closelogs").on("click", function() {
            closeLogPopup();
        })


        $("#sendpromptpschat button").on("click", function(e){

          var prompt = $("#pschatinputtxtarea").val();
          console.log(prompt);

          const respcontainer = $("#pschatpromptresponse");
          respcontainer.children().remove();


          $("#pschatpromptresponse").append(`
              <div class="reqsent">
                <div>Request Sent to PSChat</div>
                <div>Waiting for response!</div>
              </div>
            `);

          invokePSChatPrompt(prompt, function(data){

            try{
              const response = JSON.parse(data);

              if("error" in response){
                handleErrorScenarios()
              }else{
                renderPSChatResponse(response, respcontainer);
              }

            }catch(e){
              console.error(e);
              handleErrorScenarios();
            }

          }, function(error){
            console.error(error);

          });

          function handleErrorScenarios(){
            const respcontainer = $("#pschatpromptresponse");
            respcontainer.children().remove();
            respcontainer.append(`
              <div class="pschattext reqsent"> Oh Dear! I couldn't reach some of the services. Please try again after sometime. </div>
            `);
          }

        })


        $("#headersprompt").on("click", function(e) {
            console.log("executing headers prompt:");
            invokePSChatForHeaders();
        })

        $("#requestprompt").on("click", function(e) {
            console.log("executing request prompt:");
            invokePSChatForRequest();
        })

        $("#responseprompt").on("click", function(e) {
            console.log("executing request prompt:");
            invokePSChatForResponse();
        })

        //-----------------------------

        $("#getbranches").on("click", function(e) {
            populateBranches();
        })

        $("#getprojects").on("click", function(e) {
            populateProjects();
        });

        $("#createnewbranch").on("click", function(e){


          const projectid = getActiveProjectId();

          var newbranch = $(".newbranchname").val();
          var validNBranch = newbranch !== null && newbranch !== undefined && newbranch !== "";

          if(validNBranch){

            pushFileToDesignCenter("", '/libraries/dummy.yaml', projectid,  newbranch, true,
              function(){
                alert("Branch "+newbranch+" created successfully. Click on get branches to get your branch and push the code.");
                $("#newbranchname").val("");

              }, function(){
                alert("Creating a new branch failed. Please try again after some time.");
              }
            );

          }else{
            alert('Branch name cannot be empty!');
          }


        });

        $("#sendtodesigncenter").on("click", function(e) {

            var newbranch = $(".newbranchname").val();
            console.log(getActiveProjectId(), getActiveBranch(), newbranch, codefragment);

            var validNBranch = newbranch !== null && newbranch !== undefined && newbranch !== "";

            pushToTheDesignCenter(
              getActiveProjectId(),
              validNBranch ? newbranch : getActiveBranch(),
              validNBranch, codefragment);

        });

        //--------------------------------------

        $("#gentestplan").on("click", function(e){

          generateTestPlan();

        });

        $("#gendoc").on("click", function(e){
          generateTextDocumentation();
        })

        $("#searchexchange").on("click", function(e){
          populateExhcangeSearch();
        });

        $("#exchangeprojects").on("change", function(e){

          $("#apispecdetails").children().remove();

          var optionValue = $(e.target).val();
          console.log(optionValue);
          var parsed = JSON.parse(atob(optionValue));
          console.log(parsed);

          const parent = $("#apispecdetails");

          for(var key in parsed){
            parent.append(`
                <div class="specrow">
                  <div class="speccol">
                    `+key+`
                  </div>
                  <div class="speccol">
                    `+parsed[key]+`
                  </div>
                </div>

              `)
          }

        });

        $("#gengenericoas").on("click", function(e){

          generateGenericOAS();

        });

        $("#genprompts").on("click", function(e){

          generatePrompts();

        });

        $("#diagclose").on("click", function(e){
          closeDialog();
        })

        //PROMPTS _POPUP-----------------------------------------------------------
        $("#closeprompts").on("click", function() {
            closePrompts();
        })

        $("#reqbodyprompttext button").on("click", function() {

            const prompt = $("#reqbodyprompttext .promptbody p").text();
            invokePSChatPrompt(prompt, function(data) {
                console.log(data);
            }, function(error) {

            });
        })

        $("#respbodyprompttext button").on("click", function() {

            const prompt = $("#respbodyprompttext .promptbody p").text();
            invokePSChatPrompt(prompt, function(data) {
                console.log(data);
            }, function(error) {

            });
        })

        $("#headerprompttext button").on("click", function() {

            const prompt = $("#headerprompttext .promptbody p").text();
            invokePSChatPrompt(prompt, function(data) {
                console.log(data);
            }, function(error) {

            });
        })

        $("#generatemulearchtype").on("click", function(e){
          generateProject();
        })

    }

    function showDialog(addContent){
      $(".diagwindow").show();
      $(".diagwindow").addClass("diagpopup");
      $(".diagwindow .diagbody").children().remove();
      $(".diagwindow .diagbody").append(addContent);
    }
    function closeDialog(){
      $(".diagwindow").show();
      $(".diagwindow").removeClass("diagpopup");
      $(".diagwindow .diagbody").children().remove();
    }


    function populateExhcangeSearch(){

      invokeAPI('/exchange/search', "POST", {},
        {
            "searchString": $("#exchprojname").val(),
            "types": ["custom","rest-api"],
            "limit": 20,
            "offset": 0
        },  function(data){

          var result = JSON.parse(data);
          console.log(result);
          const exproj = $("#exchangeprojects");
          var html = '<option value="'+toBase64('null')+'">  Select One Project </option>';
          for(var i=0; i< result.length; i++){
            var item = result[i];
            var value = toBase64(item);
            html += '<option value="'+value+'" >'+item.name+", "+item.version+'</option>';
          }

          exproj.html(html);

        }, function(){});



      function toBase64(item){
        return btoa(JSON.stringify(item));
      }

    }

    function generateProject(){


          var optionValue = $("#exchangeprojects").val();
          console.log(optionValue);
          var parsed = JSON.parse(atob(optionValue));
          console.log(parsed);

          var name = $("#muleprojname").val();
          var version = "1.0.0-SNAPSHOT";

          var myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");

          var req =   {
                "groupId": "b601256f-0c2f-4320-a304-885ba730cbf1",
                "archetypeGroupId": "b601256f-0c2f-4320-a304-885ba730cbf1",
                "archetypeArtifactId": "sbr-mule-api-archetype",
                "archetypeVersion": "1.0.4",
                "artifactId": name,
                "version": version,
                "domainVersion": " 1.0.0-SNAPSHOT",
                "parentPomVersion": "2.0.10",
                "parentArtifactId": "sbr-mule-parent-pom",
                "commonsArtifactId": "sbr-mule-commons",
                "apiSpecGroupId": parsed.groupId,
                "apiSpecId": parsed.assetId,
                "apiSpecVersion": parsed.version,
                "apiSpecType": "OAS",
                "apiSpecExt": "yaml",
                "visualizerLayer": "System",
                "domain": false,
                "rest": true,
                "soap": false,
                "scheduler": false,
                "usingMaven": true,
                "packageName": "com.pschat.template"
              }

      console.log(req);

          var raw = JSON.stringify(
            req
              );

          var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
          };

          console.log(requestOptions);


          showDialog();
          addToDialogBody('<div class="logline">Generating maven archetype for the selected api spec.</div>');

          fetch("http://localhost:8084/mule/project/init", requestOptions)
            .then(response => response.text())
            .then(result => {

                var output = toJSON(result);
                console.log("Project created:  ", result);

                console.log(output);

                for(var i=0; i< output.logs.length; i++){
                  console.log(output.logs[i]);
                  appendToDialogBody(`
                    <div class="logline">
                    `+output.logs[i]+`
                    <div>
                    `);
                }


                if(output.result === false){
                  return;
                }


                var requestOptions = {
                  method: 'GET',
                  redirect: 'follow'
                };

                fetch("http://localhost:8084/mule/project/"+name, requestOptions)
                  .then(response => response.blob())
                  .then(result => downloadBlob(name+".zip", result))
                  .catch(error => console.log('error', error));

            })
            .catch(error => console.log('error', error));


    }

    function addPSChatErrorToDialog(){
      const respcontainer = $(".diagbody");
      respcontainer.children().remove();
      respcontainer.append(`
        <div class="pschattext reqsent"> Oh Dear! I couldn't reach some of the services. Please try again after sometime. </div>
      `);
    }

    function addToDialogBody(htmltext){
      $(".diagbody").children().remove();
      $(".diagbody").append(htmltext);
    }

    function appendToDialogBody(htmltext){
      $(".diagbody").append(htmltext);
    }

    function addRequestInProgressToDialogBody(){
      $(".diagbody").append(`
        <div class="boldmessage">
          <div>Request Sent</div>
          <div>Waiting for Response</div>
        </div>
        `);

    }

    function generateTextDocumentation(){

      showDialog();
      addRequestInProgressToDialogBody();
      const input = retrieveInputs();

      console.log(input);

      const prompt =
       'Can you please create documentation for a '+
        input.method +
        ' api endpoint named '+input.name+' having url path as '+input.path+' .'+
        'The request headers for this api is as follows '+ input.headers.content.join(" , ") +" "+
        ' with  '+input.headers.mandkeys.join(" , ")+'  as mandatory headers.'+
        'The request for this api is as follows:  '+"\n" +
        JSON.stringify(input.request.content)+
        '   with '+input.request.mandkeys.join(" , ")+' as mandatory keys.'+
        'The response for this api is as follows: '+
        JSON.stringify(input.response.content)+
        '   with'+ input.response.mandkeys.join(" , ") + 'as mandatory keys.'+
        '   Generate it as a list.';

      console.log(prompt);


      invokePSChatPrompt(prompt, function(response){

        try{
          const jsonresp = JSON.parse(response);
          console.log(jsonresp);

          renderPSChatResponse(jsonresp, $(".diagbody"));


        }catch(e){
          addPSChatErrorToDialog();
        }

      }, function(error){
        addPSChatErrorToDialog();

      });
    }

    function generateTestPlan(){

      showDialog();
      addRequestInProgressToDialogBody();
      const input = retrieveInputs();

      console.log(input);

      const prompt =
      'Can you please suggest all the possible & detailed test scenarios with serial number, test scenario, test steps, test data & expected result for automation suite for a '+
      input.method +
      ' api endpoint named '+input.name+' having url path as '+input.path+' .The request for this api is as follows:  '+"\n" +
      JSON.stringify(input.request.content)+
      ' with '+input.request.mandkeys.join(" , ")+' as mandatory keys.'+
      'The response for this api is as follows:'+
      JSON.stringify(input.response.content)+
      '   Please share the output as a html table in html language.';

      console.log(prompt);


      invokePSChatPrompt(prompt, function(response){

        try{
          const jsonresp = JSON.parse(response);
          console.log(jsonresp);
          const parsed = parsePSChatAnswer(jsonresp);
          console.log(parsed);

          for(var i =0; i<parsed.length; i++){
            var item = parsed[i];
            console.log(item);
            if(typeof(item) === 'object'){
              if(item.lang.trim().toLowerCase() === "html"){
                var table = item.lines.join("\n");
                addToDialogBody(table);
                var htmlfile = `
                  <html>
                    <head>
                      <title>PSChat Test Plan</title>
                    </head>
                    <body>
                     <h3>Please fing below the test plan as requested.</h3>
                     </br></br>
                    `+table+`
                    </body>
                  </html>
                `;

                  downloadAsFile(input.name+"TestPlan.html", htmlfile);
              }
            }
          }

        }catch(e){
          addPSChatErrorToDialog();
        }

      }, function(error){
        addPSChatErrorToDialog();

      });

    }

    function generateGenericOAS(){

      showDialog();
      addRequestInProgressToDialogBody();
      const input = retrieveInputs();

      console.log(input);

      const prompt =
       'Create an OAS for a '+
        input.method +
        ' api endpoint named '+input.name+' having url path as '+input.path+' .'+
        'The request headers for this api is as follows '+ input.headers.content.join(" , ") +" "+
        ' with  '+input.headers.mandkeys.join(" , ")+'  as mandatory headers.'+
        'The request for this api is as follows:  '+"\n" +
        JSON.stringify(input.request.content)+
        '   with '+input.request.mandkeys.join(" , ")+' as mandatory keys.'+
        'The response for this api is as follows: '+
        JSON.stringify(input.response.content)+
        '   with'+ input.response.mandkeys.join(" , ") + ' as mandatory keys.';

      console.log(prompt);


      invokePSChatPrompt(prompt, function(response){

        try{
          const jsonresp = JSON.parse(response);
          console.log(jsonresp);

          renderPSChatResponse(jsonresp, $(".diagbody"));


        }catch(e){
          addPSChatErrorToDialog();
        }

      }, function(error){
        addPSChatErrorToDialog();

      });
    }

    function parsePSChatAnswer(output) {

        var actualOutput = null;

        for (var i = 0; i < output.data.messages.length; i++) {
            var msg = output.data.messages[i];
            if (msg.role === "assistant") {
                actualOutput = msg.content;
            }
        }

        var lines = actualOutput.split("\n");
        console.log(lines);
        const response = [];
        const allcodes = [];
        var inCodeSection = false;
        var code = {
            lang: "",
            lines: []
        }

        for (var i = 0; i < lines.length; i++) {

            var line = lines[i];


            if ( line.indexOf("```") >= 0 && line.trim().startsWith("```")) {

                if (inCodeSection) {
                    response.push(code);
                    allcodes.push(code);
                    //downloadCodeSection(code.lines, "file"+i+".yaml" );
                    inCodeSection = false;
                    continue;
                }

                inCodeSection = true;
                code = {
                    lang: "",
                    lines: []
                }

                if(line.toLowerCase().startsWith("mermaid")){
                  code.lang = "mermaid";
                }

                code.lang = line.substring(3);
                continue;
            } else {
                if (inCodeSection) {
                    code.lines.push(line)

                } else {
                    response.push(line);

                }
            }
        }

        console.log(response);
        return response;

    }


    function renderPSChatResponse(output, parentDivRef) {

        var response = parsePSChatAnswer(output);
        console.log(response);

        addPSResponseToUI(response, parentDivRef);
        return response;

    }

    function addPSResponseToUI(response, parentDivRef){

        console.log(response);
        console.log(parentDivRef);

        const respcontainer = parentDivRef;
        respcontainer.children().remove();


        for(i=0; i<response.length; i++){
          var item = response[i];
          if(typeof(item) === 'object'){

            var codeSection = item.lines.join("\n");
            console.log(codeSection);

            if(item.lang === "mermaid"){
                console.log("Detected mermaid. Appending.");
                respcontainer.append(`<div class="pschatcode"><div class="mermaid">`+codeSection+`</div></div>`);

                respcontainer.append(`<div class="pschatcode"><pre>`+codeSection+`</pre></div>`);

                mermaid.init();

                console.log("initiazing mermaid complete.")

            }else{
              console.log("Detected code. Appending.")
              var highlightedcode = hljs.highlightAuto(codeSection);
              console.log(highlightedcode);
              respcontainer.append(`<div class="pschatcode"><pre>`+highlightedcode.value+`</pre></div>`);
              conosle.log("appending Successfull.");
            }

          }else{
            respcontainer.append(`
              <div class="pschattext">`+item+`</div>
            `);
          }

        }

    }

    function pushToTheDesignCenter(projectid, branchname, newbranch, oasfrags) {

      clearLogs();

      for (var i = 0; i < oasfrags.length; i++) {
        const frag = oasfrags[i];
        var fileContent = frag.lines.join("\n");
        var filepath = (frag.filepath || "" )+"/"+frag.filename;

        pushFileToDesignCenter(fileContent, filepath, projectid,  branchname, false, function(response){
          if("error" in response){
            addLogLine("Failed to push file: "+filepath+" to branch "+branchname+", Please try again.");
          }else{
            addLogLine("File: "+filepath+" has been successfully pushed to branch "+branchname);
          }
          addLogLine("File: "+filepath+" has been successfully pushed to branch "+branchname);
        }, function(error){
          console.log(error);
          addLogLine("Failed to push file: "+filepath+" to branch "+branchname+", Please try again.");
        });

      }


    }

    function toJSON(text){
      try{
        return JSON.parse(text);
      }catch(e){
        return null;
      }
    }

    function pushFileToDesignCenter(fileContent, filepath, projectid, branchname, newbranch, successCallback, errorCallback){

      console.log("pushing file to design center");

      const relativepath = "/designcenter/projects/" + projectid + "/files";
      const body = {
          "branchName": branchname,
          "branchExists": !newbranch,
          "data": {
              "opType": "UPSERT",
              "path": filepath,
              "type": "FILE",
              "content": fileContent
          }
      }

      console.log({
        relativepath : relativepath,
        body : body
      });


      invokeAPI(relativepath, "POST", {}, body, function(response){
        console.log("File pushed: "+filepath);
        console.log(response);
        const successResp = toJSON(response);
        console.log(successResp);
        if(successResp === null ){
          errorCallback(null);
          return;
        }
        if(successCallback){
          successCallback(successResp);
        }
      }, function(error){
        console.log("File pushed failed: "+filepath);
        console.log(error);
        if(errorCallback){
          errorCallback(error);
        }
      });

    }

    function populateProjects() {

        clearLogs();
        //clear everything first.

        $("#projectslist").children().remove();
        $("#designbrancheslist").children().remove();

        projectsList = [];
        branchesList = [];
        activeBranch = null;
        activeProject = null;
        pushToDesignCenterInProgress = true;



        addLogLine("Getting Projects...");


        var myHeaders = {};
        myHeaders["Content-Type"] = "application/json";
        myHeaders["Authorization"] = accessToken;

        invokeMuleNonPSChat(
            "designcenter/projects",
            "GET",
            headers, {},
            function(data) {
                var projects = JSON.parse(data);
                console.log(projects);

                var innerHTML = "";
                projects.map(item => {
                    innerHTML += '<option id="' + item.id + '" value="' + item.id + '">' + item.name + '</option>'
                })
                console.log(innerHTML);
                $("#projectslist").html(innerHTML);

            },
            function(error) {

            }
        );

    }

    function getActiveProjectId() {
        return $("#projectslist").val();
    }

    function getActiveBranch() {
        return $("#designbrancheslist").val();
    }

    function populateBranches() {

        clearLogs();
        //clear everything first.
        $("#designbrancheslist").children().remove();

        pushToDesignCenterInProgress = true;

        var projectId = getActiveProjectId();
        addLogLine("Getting Branches...");

        var myHeaders = {};
        myHeaders["Content-Type"] = "application/json";

        invokeMuleNonPSChat(
            "designcenter/projects/" + projectId + "/branches",
            "GET",
            headers, {},
            function(data) {
                var projects = JSON.parse(data);
                console.log(projects);

                var innerHTML = "";
                projects.map(item => {
                    innerHTML += '<option id="' + item.id + '" value="' + item.name + '">' + item.name + '</option>'
                })
                console.log(innerHTML);
                $("#designbrancheslist").html(innerHTML);

            },
            function(error) {

            }
        );
    }

    function invokeMuleNonPSChat(relativepath, method, headers, data, successCallback, errorCallback) {


        const apiConfig = {
            endpoint: "https://dev-api.sunbeltrentals.com/sbr-dev-pschat-poc-sapi-v1/api/v1/" + relativepath,
            headers: headers,
            method: method,
            body: JSON.stringify(data)
        }


        fetch("http://localhost:8084/checkapiresource", {
                method: "POST",
                body: JSON.stringify(apiConfig),
                headers: {
                    "Content-Type": "application/json"
                }
            })
            .then(response => response.text())
            .then(result => {

                addLogLine("Response Recieved. Processing...");
                console.log("response:", result);
                successCallback(result);

            })
            .catch(
                error => {
                    addLogLine("Response Recieved. Design Center Unavailable . Please try after some time. C-MULEERR")
                    console.log('Prompt Invoke Failed', error);
                    errorCallback(error);
                }

            );



    }

    function preventEmpty(value, message) {
        if (value === null || value === undefined || value === "") {
            alert(message);
            throw new Error(message);
        }
    }

    function addFilePathsToOasFragments(input, oasfragments, apiFragmentType) {

        for (var i = 0; i < oasfragments.length; i++) {
            var xcode = oasfragments[i];
            if (apiFragmentType === "REQUEST") {
                xcode.filepath = input.request.filepaths[xcode.filename] || "";
            } else if (apiFragmentType === "RESPONSE") {
                xcode.filepath = input.response.filepaths[xcode.filename] || "";
            } else if (apiFragmentType === "HEADERS") {
                xcode.filepath = input.headers.filepaths[xcode.filename] || "";
            }
        }

    }


    function prepareUIForPSChatRequest() {
        codefragment = null;
        clearLogs();
        popupLogs();
        hideDesignCenter();
        preventEmpty(accessToken, "Please configure a ps chat access token first. You can get it from developer section.");
        const input = retrieveInputs();
        console.log("User Input", input);
        return input;
    }

    function parseAndPreventUnparsablePSChatResponse(responseText) {
        try {
            response = JSON.parse(responseText);
            addLogLine("Response Parsed Successfully");
            return response;
        } catch (e) {
            addLogLine("Aborting! Seems PSChat returned unparsable result! Try again!");
            throw new Error("Aborting! Seems PSChat returned unparsable result! Try again!");
        }
    }


    function handlePSChatErrorResponse(response, errors) {
        errors.push({
            message: "Unable to generate the OAS through PS Chat.",
            error: response.error
        });
        addLogLine("PS Chat is unable to return a response at this time. Please try again. C-SCHATGPTMULERR");

    }

    function handlePSChatValidResponse(input, response, possibleFileNames, overrideCommonFileName) {
        console.log(overrideCommonFileName);
        addLogLine("Extracting Code Sections from PSChat response.");

        const requestCode = extractCode(response, possibleFileNames);

        for (var i = 0; i < requestCode.length; i++) {
            var xcode = requestCode[i];
            if (xcode.filename.indexOf("common") !== -1) {
                xcode.filename = overrideCommonFileName;
            }
        }

        console.log("overriden file name");
        console.log(requestCode);


        try {
            addLogLine("Code Extraction Successfull. Trying to download code files to your system.");

            console.log("request code sections");
            console.log(requestCode);
            downloadAllFiles(requestCode);

            addLogLine("Code files downloaded to your system. Please check your download files.")

        } catch (e) {
            console.log(e);
        }

        return requestCode;

    }

    //------OAS FRAGMENT REQUESTS-----------------------------------------------

    function psChatErrorUserDailog(error) {
        alert("PSChat seems to be Unavailable at the moment. Please try again.");
    }

    function invokePSChatForRequest() {

        const input = prepareUIForPSChatRequest();
        addLogLine("Preparing to generate Request OAS Fragments through PSChat");
        const prompts = getAPIResourcePrompts(input);
        const prompt = prompts.requestbody;
        console.log("prompt", prompt);
        addLogLine("Prompt Created!");

        const errors = [];

        invokePSChatPrompt(prompt, function(responseText) {

            //see if this is a valid json.
            var response = parseAndPreventUnparsablePSChatResponse(responseText);
            console.log("PS CHAT Response", response);

            if (response.error) {
                handlePSChatErrorResponse(response, errors);
            } else {

                var oasfrags = handlePSChatValidResponse(input, response, [
                    "common.yaml", input.request.filenames.body, input.request.filenames.oas
                ], input.request.filenames.common);

                addFilePathsToOasFragments(input, oasfrags, "REQUEST");
                codefragment = oasfrags;
                showDesignCenter();

            }
        }, psChatErrorUserDailog);

    }

    function invokePSChatForResponse() {

      const input = prepareUIForPSChatRequest();
      addLogLine("Preparing to generate Response OAS Fragments through PSChat");
      const prompts = getAPIResourcePrompts(input);
      const prompt = prompts.responsebody;
      console.log("prompt", prompt);
      addLogLine("Prompt Created!");

      const errors = [];

      invokePSChatPrompt(prompt, function(responseText) {

          //see if this is a valid json.
          var response = parseAndPreventUnparsablePSChatResponse(responseText);
          console.log("PS CHAT Response", response);

          if (response.error) {
              handlePSChatErrorResponse(response, errors);
          } else {

              var oasfrags = handlePSChatValidResponse(input, response, [
                  "common.yaml", input.response.filenames.body, input.response.filenames.oas
              ], input.response.filenames.common);

              addFilePathsToOasFragments(input, oasfrags, "RESPONSE");
              codefragment = oasfrags;
              showDesignCenter();

          }
      }, psChatErrorUserDailog);

    }

    function invokePSChatForHeaders() {


      const input = prepareUIForPSChatRequest();
      addLogLine("Preparing to generate Request OAS Fragments through PSChat");
      const prompts = getAPIResourcePrompts(input);
      const prompt = prompts.headers;
      console.log("prompt", prompt);
      addLogLine("Prompt Created!");

      const errors = [];

      invokePSChatPrompt(prompt, function(responseText) {

          //see if this is a valid json.
          var response = parseAndPreventUnparsablePSChatResponse(responseText);
          console.log("PS CHAT Response", response);

          if (response.error) {
              handlePSChatErrorResponse(response, errors);
          } else {

              var oasfrags = handlePSChatValidResponse(input, response, [
                  "commonHeaders.yaml",  input.headers.filenames.oas
              ], input.headers.filenames.common);

              addFilePathsToOasFragments(input, oasfrags, "HEADERS");
              codefragment = oasfrags;
              showDesignCenter();

          }
      }, psChatErrorUserDailog);

    }



    //-----API CALLS-------------------------------------------------------------
    function invokePSChatPrompt(prompt, successCallback, errorCallback) {
        const bodycontent = {
            "model": "gpt4",
            "assistant": "You are a helpful AI assistant. If you do not know the answer to a question, respond by saying \"I do not know the answer to your question.\". Act as a senior software engineer.\nRespond in markdown format when possible.code parts should start with ```langauge and end with ``` . if asked for uml generate mermaid code and start the mermaid code with ```mermaid .",
            "role": "assistant",
            "parameters": {
                "temperature": 0,
                "max_tokens": 4000
            },
            "prompts": prompt
        };


        invokeAPI("/pschat", "POST", {}, bodycontent, successCallback, errorCallback);


    }

    function invokeAPI(relativepath, method, headers, data, successCallback, errorCallback) {

      headers["Content-Type"] = "application/json";
      headers["x-correlation-id"] = "pschatutil_"+ (new Date().getTime()) + "-"+ (Math.floor(Math.random()*10000000000));


        console.log("sending request:");
        console.log({
            relativepath: relativepath,
            method: method,
            headers: headers,
            data: data
        });

        var host = window.location.host;
        var isLocalDeployment = host.toLowerCase().indexOf("localhost") != -1;

        if (isLocalDeployment) {
            console.log("Detected local deployment. Redirecting all api calls to localhost.");
            invokeLocal(relativepath, method, headers, data, successCallback, errorCallback);
        } else {
            console.log("Detected production deployment. Redirecting all api calls to production.");
            invokeProduction(relativepath, method, headers, data, successCallback, errorCallback);
        }

    }

    function invokeProduction(relativepath, method, headers, data, successCallback, errorCallback) {}

    function invokeLocal(relativepath, method, headers, data, successCallback, errorCallback) {

        headers["originalauth"] = accessToken;

        var localProxyURL = "http://localhost:8084/checkapiresource";

        var proxyHeaders = {};
        proxyHeaders["Content-Type"] = "application/json";

        var raw = JSON.stringify(data);

        var requestconfig = {
            endpoint: psChatEndpointForLocalUseOnly + relativepath,
            method: method,
            headers: headers,
            body: raw,
            uriparams: {},
            params: {}
        };


        fetch(localProxyURL, {
                method: 'POST',
                body: JSON.stringify(requestconfig),
                headers: proxyHeaders
            })
            .then(response => response.text())
            .then(result => {
                addLogLine("Response Recieved. Processing...");
                console.log("response:", result);
                successCallback(result);

            })
            .catch(
                error => {
                    addLogLine("Response Recieved. PSChat Unavailable . Please try after some time. C-GPTRRERR")
                    console.log('Prompt Invoke Failed', error);
                    errorCallback(error);
                }
            );


    }

    return new ChatGPT();



}

function switchTab(name){
  $(".section").hide();
  switch (name) {
    case "Mule Initializr":
      $("#mulestartproject").show();
      break;
    case "homepage":
      $("#homepage").show();
      break;
    case "OAS":
      $("#oassection").show();
      break;
    case "Test Data":
      $("#testdatasection").show();


      break;
    case "PSChat Prompts":
      $("#pschatpromptsection").show();
      break;

    default:

  }
}




const cgpt = new ChatGPTUI();

cgpt.bindControls();

switchTab("homepage");
