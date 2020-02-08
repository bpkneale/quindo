import React from 'react';
import FileSelector from './file-selector';
import {Editor} from './editor';
import "./App.css"

interface IAppProps {
}

interface IAppState {
    mainstate: string;
    file: File | null;
}

export class App extends React.Component<IAppProps, IAppState> {
    constructor(props: IAppProps) {
        super(props);
        this.state = {
            mainstate: "intro",
            file: null
        }
    }

    onImageSelected(newfile: File) {
        this.setState({
            file: newfile,
            mainstate: "editor"
        });
    }

    render() {
        switch(this.state.mainstate) {
            case "intro": {
                return this.renderIntro();
            }

            case "editor": {
                return this.renderEditor();
            }
        }
        return <div><p>Something went wrong!</p></div>
    }

    renderIntro() {
        return (
            <div className="App">
                <header className="App-header">
                    Quindo-Surveyor
                    <br></br>
                    <FileSelector
                    onImageSelected={(file) => {this.onImageSelected(file)}}
                    />
                </header>
            </div>
        )
    }

    renderEditor() {
        if(this.state.file != null) {
            return <Editor file={this.state.file}/>
        }
        return <div></div>
    }
}
