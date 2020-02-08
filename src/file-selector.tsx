import React from 'react';

interface IFileSelectorProps {
    onImageSelected: (image: File) => void;
}

interface IFileSelectorState {

}

class FileSelector extends React.Component<IFileSelectorProps, IFileSelectorState> {
    handleFileInput(event: React.ChangeEvent<HTMLInputElement>) {
        if(event.target.files != null) {
            const file = event.target.files[0];
            if(file != null) {
                this.props.onImageSelected(file);
            }
        }
    }

    render() {
        return (
            <input type="file" onChange={this.handleFileInput.bind(this)}></input>
        )
    }

};

export default FileSelector;
