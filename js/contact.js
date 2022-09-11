function loadContact() {
    if (getCookie("messageSent") != "") {
        displaySentMessage(getCookie("messageSent").split("$"))
    }
}

function displaySentMessage(messageElements) {
    document.getElementById('name-div').remove()
    document.getElementById('email-div').remove()
    document.getElementById('message-div').remove()
    document.getElementById('legend').innerHTML = "Thanks for reaching out!"
    document.getElementById('legend').style.textAlign = "center"
    document.getElementById('submit-button').outerHTML = (
        '<div id="output"><pre id="sent-message" class="sent-message"></pre></div>'
    ) + document.getElementById('submit-button').outerHTML
    document.getElementById('submit-button').onmouseenter = null
    document.getElementById('submit-button').onmouseleave = null
    document.getElementById('sent-message').innerHTML = (
        'From:  <b>' + messageElements[0] + '</b>\n    &lt;' + messageElements[1] + '&gt;\n' +
        'To:  <b>Kody Puebla</b>\n    &lt;pueblakody@gmail.com&gt;\n' +
        '\Message:\n    <i>' + messageElements.slice(2).join("$") + '</i>'
    )
    document.getElementById('send').src = 'resources/checkmark.svg'
    document.getElementById('send').style.marginLeft = '3.5rem'
    document.getElementById('submit').value = 'Sent'
    document.getElementById('submit').style.backgroundColor = "#70ff70a4"
    document.getElementById('submit').style.fontWeight = "normal"
    document.getElementById('submit').style.paddingLeft = "0"
    document.getElementById('submit').style.paddingRight = "1rem"
}

function sendMessage() {
    if (getCookie("messageSent") != "") {
        alert("You have already sent a message within the last 30 minutes. "
              + "Please wait to send another.")
        return false
    }

    const name = document.getElementById('name').value
    const sender = document.getElementById('email').value
    const messageValue = document.getElementById('message').value

    // Validate all fields in the form
    let valid = true
    const fields = [  // (id, validation boolean, error message)
        {
            id: 'message',
            isValid: name != "",
            errorMessage: "Say something! I would love to hear from you!"
        },
        {
            id: 'email',
            isValid: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(sender),
            errorMessage: "Are you sure you entered this correctly?"
        },
        {
            id: 'name',
            isValid: messageValue != "",
            errorMessage: "How would you like me to address you?"
        }
    ]
    for (let field of fields) {
        if (field.isValid) {
            if (document.getElementById(field.id).classList.contains("input-error")) {
                document.getElementById(field.id).classList.remove("input-error")
                document.getElementById(field.id).classList.add("input-valid")
            }
            document.getElementById(field.id + '-error').innerHTML = ""
        } else {
            if (document.getElementById(field.id).classList.contains("input-valid")) {
                document.getElementById(field.id).classList.remove("input-valid")
                document.getElementById(field.id).classList.add("input-error")
            }
            document.getElementById(field.id + '-error').innerHTML = field.errorMessage
            document.getElementById(field.id).focus()
            valid = false
        }
    }

    if (valid) {
        Email.send({
            SecureToken : "12422c68-7d67-44ef-9d3e-8ec8d0747602",
            To : "pueblakody@gmail.com",
            From : "noreply@kody-puebla.com",
            Subject : "Message from " + name,
            Body : ('<html><body><pre style="font-family: sans-serif;font-size: 1rem">'
                    + messageValue + "\n\nPlease reply to: " + sender + "</pre></body></html>")
        }).then(
            message => { if (message !== "OK") { 
                alert(message)
                return false
            } return true }
        ).then(
            success => { if (success) setCookie("messageSent", [name, sender, messageValue].join("$"), 1.0/48); return success}
        ).then(
            success => { if (success) Email.send({
                SecureToken : "12422c68-7d67-44ef-9d3e-8ec8d0747602",
                To : sender,
                From : "noreply@kody-puebla.com",
                Subject : "Copy of Message from " + name,
                Body : ('<html><body><pre style="font-family: sans-serif;font-size: 1rem">'
                        + "Below is a copy of the message sent to pueblakody@gmail.com:\n"
                        + '\n<blockquote style="font-style: italic">' + messageValue + "\n\nPlease reply to: "
                        + sender + "</blockquote>\nIf you do not get a reply within "
                        + "48 hours, this may have ended up in my spam folder. Feel "
                        + "free to email me directly at "
                        + '<a href="mailto:pueblakody@gmail.com">pueblakody@gmail.com</a>.'
                        + "</pre></body></html>")
            }).then(
                message => {
                    if (message !== "OK") {
                        alert("The message was sent successfully to Kody, "
                              + "but there was an error when sending a copy "
                              + "to your email:\n\n" + message)
                    } else {
                        alert("Message sent successfully. A copy has been sent to your email.")
                        displaySentMessage([name, sender, messageValue])
                    }
                }
            )}
        )
        for (let field of fields) {
            document.getElementById(field.id).value = ""
        }
    } else {
        document.getElementById('contact-form').addEventListener('submit', function(e){
            e.preventDefault()
        })
    }
    return valid
}

function animate_send() {
    document.getElementById('send').classList.add('float-right-animation')
    document.getElementById('submit').classList.add('float-left-animation')
}

function unanimate_send() {
    document.getElementById('send').classList.remove('float-right-animation')
    document.getElementById('submit').classList.remove('float-left-animation')
}