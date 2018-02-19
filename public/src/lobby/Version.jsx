import React from "react"

export default function Version({version}) {
    return (
        <p>Running Version{' '}
            <a href={`https://github.com/dr4fters/dr4ft/commit/${version}`}>
                {version}
            </a>
        </p>
    )
}
