function buildsquarebracemap(code) {
    temp_bracestack = []
    bracemap = {}
    code = code.split("")
    for (const [position, command] of code.entries()) {
        if (command === "[") { temp_bracestack.push(position) }
        if (command === "]") {
            start = temp_bracestack.pop()
            bracemap[start] = position
            bracemap[position] = start
        }
    }
    return bracemap
}

function buildroundbracemap(code) {
    temp_bracestack = []
    bracemap = {}
    code = code.split("")
    for (const [position, command] of code.entries()) {
        if (command === "(") { temp_bracestack.push(position) }
        if (command === ")") {
            start = temp_bracestack.pop()
            bracemap[start] = position
            bracemap[position] = start
        }
    }
    return bracemap
}

function buildlongcondbracemap(code) {
    temp_bracestack = []
    bracemap = {}
    code = code.split("")
    for (const [position, command] of code.entries()) {
        if (command === "<") { temp_bracestack.push(position) }
        if (command === ">") {
            start = temp_bracestack.pop()
            bracemap[start] = position
            bracemap[position] = start
        }
    }
    return bracemap
}

function debug_stack(stack, char, pos) {
    var current = document.getElementById('stack-debug').innerHTML
    document.getElementById('stack-debug').innerHTML = current.toString() + "<br>" + char.toString() + " : " + pos.toString() + " : [" + stack.toString() + "]"
        //console.log(current.toString() + "\n" + stack.toString())
}

function run_code() {
    const code = document.getElementById('MAWP').value
    const input = document.getElementById('input').value
    document.getElementById('code-output').innerHTML = ''
    document.getElementById('stack-debug').innerHTML = 'chr:pos:stack'
        //console.log(code)
        //console.log(buildsquarebracemap(code))
    var char = ''
    var pos = 0
    var stack = [1]
    var top
    var sec
    var numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    var output = ''
    const squarebracemap = buildsquarebracemap(code)
    const roundbracemap = buildroundbracemap(code)
    const longcondbracemap = buildlongcondbracemap(code)
    while (true) {
        //console.log(pos)
        char = code.charAt(pos)
            //console.log(char)
            //console.log(typeof char)
        if (numbers.includes(char)) {
            stack.push(parseInt(char))
        } else if (char == 'M') {
            top = stack.pop()
            sec = stack.pop()
            stack.push(top + sec)
        } else if (char == 'A') {
            top = stack.pop()
            sec = stack.pop()
            stack.push(Math.abs(top - sec))
        } else if (char == 'W') {
            top = stack.pop()
            sec = stack.pop()
            stack.push(top * sec)
        } else if (char == 'P') {
            top = stack.pop()
            sec = stack.pop()
            stack.push(Math.floor(sec / top))
        } else if (char == '%') {
            stack.pop()
        } else if (char == '.') {
            document.getElementById('code-output').innerHTML = output
                //console.log(output)
            return 0
        } else if (char == '!') {
            var temp = stack.pop()
            stack.push(temp, temp)
        } else if (char == ':') {
            output += stack.pop()
        } else if (char == ';') {
            var temp = stack.pop()
            output += String.fromCharCode(temp)
        } else if (char == '?') {
            if (stack[stack.length - 1] != 0) {
                ++pos
            }
        } else if (char == '[') {
            if (stack[stack.length - 1] == 0) {
                pos = squarebracemap[pos]
            }
        } else if (char == ']') {
            if (stack[stack.length - 1] != 0) {
                pos = squarebracemap[pos]
            }
        } else if (char == '(') {
            if (stack[stack.length - 1] != 0) {
                pos = roundbracemap[pos]
            }
        } else if (char == ')') {
            if (stack[stack.length - 1] == 0) {
                pos = roundbracemap[pos]
            }
        } else if (char == '<') {
            if (stack[stack.length - 1] != 0) {
                pos = longcondbracemap[pos]
            }
        } else if (char == '|') {
            for (let i = 0; i < input.length; ++i) {
                stack.push(input[i].charCodeAt(0))
            }
        } else if (char == '~') {
            stack = stack.reverse()
        }
        pos += 1
            //console.log(stack)
        if (output.length > 2048) {
            document.getElementById('code-output').innerHTML = output + "\nOutput reached limit of 2kb and was truncated."
            return 0
        }

        debug_stack(stack, char, pos)

        if (pos == code.length) {
            return 1
        }
    }
}
//https://8dion8.github.io/?code=%5B!!3P3WA%3C75W2W%3B73W5W%3B65W2W1M2W%3B65W2W1M2W%3B%3E%25!!5P5WA%3C92M6W%3B94M9W%3B65W2W1M2W%3B65W2W1M2W%3B%3E%25!55WA%3F.%251M25W%3B%5D&input=%23Fizz%2075W2W%3B73W5W%3B65W2W1M2W%3B65W2W1M2W%3B%20%23Buzz%2092M6W%3B94M9W%3B65W2W1M2W%3B65W2W1M2W%3B