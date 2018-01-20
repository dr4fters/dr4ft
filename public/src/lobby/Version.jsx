import React from "react"

//TODO: Read the remote origin url!
export default function Version({version}) {
    return (
        <p>Running Version{' '}
            <a href="https://github.com/dr4fters/dr4ft/commit/{version}">
                {version}
            </a>
        </p>
    )
}
