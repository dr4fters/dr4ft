import React, { Component } from "react";

class FileUpload extends Component {

    constructor(props) {
        super(props);
        this.state = this.defaultState();
        this.onChangeFile = this.onChangeFile.bind(this);
    }

    defaultState() {
        return {
            fileName: "Import custom set",
            resultStatus: "",
            resultClass: "success"
        };
    }

    onChangeFile({ target }) {
        if (!target.files[0]) {
            return this.setState(this.defaultState());
        }

        const data = new FormData();
        data.append("file", target.files[0]);
        fetch("/api/sets/upload", {
            method: "POST",
            body: data
        })
            .then(response => {
                if (/^2/.exec(response.status)) {
                    this.setState({
                        resultStatus: "Upload completed!",
                        resultClass: "success"
                    });
                } else {
                    this.setState({
                        resultStatus: "Upload error: " + response.statusText,
                        resultClass: "error"
                    });
                }
            })
            .catch(error => {
                this.setState({
                    resultStatus: "Upload error: " + error.statusText,
                    resultClass: "error"
                });
            });

        this.setState({
            fileName: target.value.split('\\').pop(),
            resultClass: "success"
        });
    }

    render() {
        return (
            <fieldset className='fieldset'>
                <legend className='legend'>
                    Upload Custom Set
                </legend>
                <input type="file" name="file" onChange={this.onChangeFile} id="file" className="inputfile" accept=".json" />
                <label className="uploadFile" for="file">{this.state.fileName}</label>
                <p className={this.state.resultClass}>{this.state.resultStatus}</p>
            </fieldset>
        )
    }
}

export default FileUpload;
