console.log('location:', document.location)
document.api = 'https://sp4s6v0l6j.execute-api.us-east-1.amazonaws.com/prod/masterapi-prod?'



var checkcodeinput = function (e) {
    console.log('checking...', e)
    e.target.value = e.target.value.toUpperCase()
    console.log('checking...', document.getElementById('codeinput'))
    if (e.target.value.length >= 6) {
        document.location = '/#activate=' + e.target.value
    }
}
document.getElementById('codeinput').oninput = checkcodeinput

var qJSON = function (hash) {
    var info = {}
    var sdata = hash.replace('?', '').replace('#', '').split('&')

    sdata.forEach(function (each_item) {
        var key = each_item.split('=')[0].replace('/', '')
        if (key != null && key != undefined && key.length > 0) {
            if (each_item.split('=')[1] != undefined) {
                info[key] = each_item.split('=')[1]
            } else {
                info[key] = '1'
            }
        }
    })
    return info
}

if (document.config == undefined) {
    document.config = {}
}

document.config['name'] = document.location.hostname.split('.')[1],
    document.config['params'] = qJSON(document.location.hash)

var JSONq = function (params) {
    var hash = []
    Object.keys(params).forEach(function (key) {
        hash.push(key + '=' + params[key])
    })
    return hash.join('&')
}

var updateHash = function () {
    document.location.hash = JSONq(document.config.params)
}

var fillFields = function (params, extra, bad_extra) {
    if (extra == undefined) {
        extra = ""
    }
    Object.keys(params).forEach(function (param) {
        if (document.getElementById(param) != null) {
            if (params[param].indexOf('DISABLED') > -1) {
                document.getElementById(param).innerHTML = bad_extra + decodeURI(params[param]) + ' <a onclick="location.reload()" href="#activate=now" class="btn enabler btn-yellow">ENABLE</a>'
                extra = ''
            } else {
                document.getElementById(param).innerHTML = extra + decodeURI(params[param])

            }
        }
    })
}
var countDownDate
var x
var now
var hide_manage = false
var countdown = function () {
    now = now + 1000;
    var distance = countDownDate - now;

    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('daysleft').innerHTML = days + "d " + hours + "h " +
        minutes + "m " + seconds + "s ";

    if (distance < 0) {
        clearInterval(x);
        document.getElementById('passcode').innerHTML = '<strike>' + document.getElementById('passcode').innerHTML + '</strike>'

        document.getElementById('daysleftleft').innerHTML = "Already <u>expired</u>";
        document.getElementById('daysleft').innerHTML = "<a class='getnewone'>GET A NEW ONE</a>";
    }
};

var check_symbol = ' <i class="green fa fa-check" aria-hidden="true"></i> '
var check_symbol_thumb = ' <i class="green fa fa-thumbs-up" aria-hidden="true"></i> '
var bad_check_symbol = ' <i class="red fa fa-thumbs-down" aria-hidden="true"></i> '
var retry = 0

var showParts = function (parts) {
    parts.forEach(function (id) {
        if (document.getElementById(id) !== null) {
            document.getElementById(id).style.display = ''
        }
    })
}
var hideParts = function (parts) {
    parts.forEach(function (id) {
        if (document.getElementById(id) !== null) {
            document.getElementById(id).style.display = 'none'
        }
    })
}
var showActivationInfo = function () {
    showParts(['activationcode', 'activationexpire'])
}

var checkIp = function (ip, callback) {
    window.fetch(document.api + JSONq({
        checkip: ip
    })).then(function (response) {
        return response.json()
    }).then(function (json) {
        console.log('<checkIp>:result', json)
        if (json.status.indexOf('ENA') === 0) {
            if(Cookies.get('code') != undefined){
                document.getElementById('calltoaction').style.display = ""                
                document.getElementById('calltoaction').innerHTML = 'Manage'
                document.getElementById('calltoaction').href = '/#/manage'
            } else {
                document.getElementById('calltoaction').style.display = "none"
            }
        }
        fillFields(json, check_symbol_thumb, bad_check_symbol)
        if (callback) {
            callback(json)
        }
    })
}

var applyCode = function (code, callback, failback) {
    console.log('<applyCode>', code)
    window.fetch(document.api + JSONq({
        code: code
    })).then(function (response) {
        return response.json()
    }).then(function (json) {
        console.log('<applyCode>response:', json)
        if (json.status === undefined) {
            callback = failback
        }
        if (callback) {
            callback(json)
        }
    }).catch(function (err) {
        console.log('<applyCode>error:', err)
        if (failback) {
            failback(err)
        }
    })
}

var getTx = function (code, callback, failback) {
    window.fetch(document.api + JSONq({
        code_tx: code
    })).then(function (response) {
        return response.json()
    }).then(function (json) {
        if (json.tx == undefined) {
            callback = failback
        }
        if (callback) {
            callback(json.tx)
        }
    }).catch(function (err) {
        if (failback) {
            failback(err)
        }
    })
}

console.log('CONFIG', document.config)
var has = function (param) {
    return params.indexOf(param) > -1
}
var params = Object.keys(document.config.params)

if (params.indexOf('pricing') > -1) {
    hideParts(['ipinfo'])
    showParts(['pricing'])
}

if (has('manage')) {
    if (Cookies.get('tx') == undefined) {
        if(Cookies.get('code') == undefined){
            document.location = '/'            
        } else {
            getTx(Cookies.get('code'), function (tx) {
                Cookies.set('tx', tx)
                document.location = '/#/tx=' + tx + '&amt=true'
            })
        }
    } else {
        document.location = '/#amt=true&'+'tx=' + Cookies.get('tx')
    }
}

if (has('activate')) {
    if (['done', 'now'].indexOf(document.config.params['activate']) == -1) {
        console.log('not now nor done')
        checkIp(document.config.params['activate'], function (ip) {
            console.log('ip', ip)
            if (ip.status.indexOf('ENABLED') == -1) {
                showActivationInfo()

                applyCode(document.config.params['activate'], function (json) {
                    json['passcode'] = json['code']
                    var postjson = {}
                    if (json.status === 'ENABLED') {
                        console.log('code enabled!!')
                        hideParts(['entercode'])
                        showParts(['manage'])
                        showParts(['setup'])
                        Cookies.set('code', document.config.params['activate'])
                        countDownDate = new Date(json.expiration_date).getTime()
                        now = new Date().getTime()
                        countdown()
                        x = setInterval(countdown, 1000)
                    }
                    postjson['status'] = json['status']
                    json['status'] = '<img class="ipactivation" src="/images/30.gif" />'
                    fillFields(json, check_symbol)
                    console.log('json??', json)
                    document.getElementById('statusmessage').innerHTML = "Activating..."
                    setTimeout(function () {
                        document.getElementById('statusmessage').innerHTML = "Service"
                        fillFields(postjson, check_symbol)
                    }, 4000)
                }, function (json) {
                    console.log('INVALID CODE')
                    fillFields({
                        passcode: 'INVALID',
                        daysleft: '--'
                    }, '')
                    hideParts(['daysleftleft', 'daysleft'])
                    showParts(['pricing'])
                })
            } else {
                getTx(document.config.params['activate'], function(tx){
                    console.log('tx', tx)
                    if(tx!=undefined){
                        showParts(['manage'])
                        Cookies.set('code', document.config.params['activate'])
                        Cookies.set('tx',tx)
                        hideParts(['entercode'])
                    }
                })
                console.log('already enabled :)')
                hideParts(['activationcode', 'activationexpire'])
                showParts(['setup'])
                fillFields(ip, check_symbol)
            }
        })
    } else {
        if (Cookies.get('code') !== undefined) {
            // if (document.config.params['activate'] !== 'done') {
                // showActivationInfo()
                // window.fetch(document.api + JSONq({
                //     checkip: Cookies.get('code')
                // })).then(function (response) {
                //     return response.json()
                // }).then(
                checkIp(Cookies.get('code'),function (json) {
                    console.log('-status:', json)
                    if (json.status.indexOf('ENABLED') == -1) {
                        window.fetch(document.api + JSONq({
                            code: Cookies.get('code')
                        })).then(function (response) {
                            return response.json()
                        }).then(function (json) {
                            console.log('activated?', json)
                            document.getElementById('statusmessage').innerHTML = "Activating..."
                            setTimeout(function () {
                                document.getElementById('statusmessage').innerHTML = "Service"
                                fillFields(json, check_symbol_thumb, bad_check_symbol)
                            }, 8000)
                        })
                    } else {
                        hideParts(['activationcode', 'activationexpire'])
                        fillFields(json, check_symbol_thumb, bad_check_symbol)
                    }
                    showParts(['setup'])
                })
            // } else {
            //     console.log('default option...')
            //     window.fetch(document.api + JSONq({
            //         checkip: Cookies.get('code')
            //     })).then(function (response) {
            //         return response.json()
            //     }).then(function (json) {
            //         console.log(json)
            //         fillFields(json, check_symbol_thumb, bad_check_symbol)
            //         showParts(['setup'])
            //     })
            // }
        } else {
            console.log('activate, but no code in cookie...')
            showParts(['pricing'])
            hideParts(['ipinfo'])
        }
    }

}


if (document.config.params['tx'] != undefined) {
    hide_manage = true
    hideParts(['manage'])
    showActivationInfo()
    console.log('config', document.config)
    if (document.config.params['amt'] != undefined) {
        console.log('==> show payment info!')
        document.getElementById('paymentinfo').style.display = ''
    }
    // hideParts(['service', 'forip'])


    fillFields(document.config.params)
    var checkTX = function () {
        retry = retry + 1
        window.fetch(document.api + JSONq({
            tx: document.config.params['tx']
        })).then(function (response) {
            return response.json()
        }).then(function (json) {
            Cookies.set('tx', document.config.params['tx']);
            fillFields(document.config.params, check_symbol)
            window.fetch(document.api + JSONq({
                tx_code: document.config.params['tx']
            })).then(function (response) {
                return response.json()
            }).then(function (json) {
                console.log('tx_code', json)
                countDownDate = new Date(json.Items[0].expiration_date).getTime()
                now = new Date().getTime()
                countdown()
                x = setInterval(countdown, 1000)
                Cookies.set('expiration', countDownDate);
                document.getElementById('passcode').innerHTML = json.Items[0].code
                Cookies.set('code', json.Items[0].code);
                hideParts(['txhelp'])

                window.fetch(document.api + JSONq({
                    checkip: json.Items[0].code
                })).then(function (response) {
                    return response.json()
                }).then(function (json) {
                    console.log(json)
                    fillFields(json, check_symbol_thumb, bad_check_symbol)
                })


            })

            console.log(json)
            fillFields(json, check_symbol)
        }).catch(function () {
            if (retry < 10) {
                setTimeout(checkTX, 1000 * retry)
            } else {
                showParts(['txhelp'])
            }
            console.log('tx not founc!')
        })
    }
    checkTX()
}



if (Object.keys(document.config.params).length == 0) {
    showParts(['main', 'setup'])
    checkIp(Cookies.get('code'))
}

var try_plan = document.config[document.config.name]['plans']['try']
var payment = 'paypal'
document.getElementById('try-plan-item-price').innerHTML = try_plan.price.split('.')[0] + '.<small>' + try_plan.price.split('.')[1] + '</small>'
document.getElementById('try-plan-item-description').innerHTML = try_plan.description
document.getElementById('try-plan-item-button').innerHTML = try_plan[payment]
document.getElementById('try-plan-item-header').innerHTML = try_plan.header

var update = {}
var plan_template = document.getElementById('plan_template').innerHTML
for (var each_plan = 1; each_plan <= 2; each_plan++) {
    var replaced_template = plan_template.replace(new RegExp('NUM', 'g'), each_plan)
    document.getElementById('plans').innerHTML = document.getElementById('plans').innerHTML + replaced_template
}

var setup_template = document.getElementById('setup_template').innerHTML
var setups = document.config[document.config.name]['setup']
var replaced_template
for (var each = 0; each < setups.length; each++) {
    replaced_template = setup_template.replace(new RegExp('NUM', 'g'), each)
    document.getElementById('setups').innerHTML = document.getElementById('setups').innerHTML + replaced_template
    Object.keys(setups[each]).forEach(function (atrr) {
        update['setup' + each + '-' + atrr] = setups[each][atrr]
    })
}

for (var each_plan = 1; each_plan <= 2; each_plan++) {
    var plan = document.config[document.config.name]['plans']['plan' + each_plan]
    Object.keys(plan).forEach(function (attrib) {
        if (typeof (plan[attrib]) == 'string' && plan[attrib].indexOf('$') > -1) {
            var parts = plan[attrib].split('.')
            var first_part = parts.shift()
            update['plan' + each_plan + '-' + attrib] = first_part + '.<small>' + parts.join('.') + '</small>'
        } else {
            update['plan' + each_plan + '-' + attrib] = plan[attrib]
        }
    })
}

update['slogan'] = document.config[document.config.name]['slogan']
update['calltoaction'] = document.config[document.config.name]['calltoaction']
fillFields(update)

if (Cookies.get('code') === undefined &&
    Cookies.get('tx') === undefined &&
    !has('tx') && !has('code')
) {
    showParts(['entercode'])
} else {
    if(!hide_manage){
        showParts(['manage'])
    }
}