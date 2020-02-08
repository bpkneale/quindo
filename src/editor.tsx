import React from 'react';
import {Legend, PointReference, Mapping} from './legend';
import './editor.css';
import { isFunction } from 'util';
import { readFile } from 'fs';

interface IEditorProps {
    file: File;
};

interface IEditorState {
    loading: null | boolean;
    fileContents: any;
    x: number;
    y: number;
    references: PointReference[];
    long: number | null;
    lat: number | null;
    clicked: boolean;
    clickedPos: {x: number, y: number};
};

export class Editor extends React.Component<IEditorProps, IEditorState> {
    constructor(props: IEditorProps) {
        super(props);
        this.state = {
            loading: false,
            fileContents: null,
            x: 0,
            y: 0,
            references: [],
            long: null,
            lat: null,
            clicked: false,
            clickedPos: {x: 0, y: 0}
        }
        var reader  = new FileReader();
        reader.onload = (e) => { this.onFileLoad(e) };
        reader.readAsDataURL(this.props.file);
    }

    onFileLoad(e: ProgressEvent<FileReader>) {
        if(e.target != null) {
            this.setState({
                fileContents: e.target.result
            });
        }
    }

    onMouseMove(e: React.MouseEvent<HTMLImageElement, MouseEvent>) {
        this.setState({
            x: (e.clientX),
            y: (e.clientY)
        })
    }

    onClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        this.setState({
            clicked: true,
            clickedPos: {
                x: event.clientX,
                y: event.clientY
            }
        });
    }

    onLongitudeChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            long: parseFloat(event.target.value)
        });
    }

    onLatitudeChange(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState({
            lat: parseFloat(event.target.value)
        });
    }

    onKeydown(event: React.KeyboardEvent<HTMLInputElement>) {
        if(event.key === "Enter") {
            this.onCoordsSubmit(event);
        }
    }

    onCoordsSubmit(event: React.FormEvent<HTMLInputElement>) {
        if(this.state.long != null && this.state.lat != null) {
            const refs = [...this.state.references];
            refs.push({
                x: this.state.clickedPos.x,
                y: this.state.clickedPos.y,
                long: this.state.long,
                lat: this.state.lat
            })
            this.setState({
                references: refs,
                long: null,
                lat: null,
                clicked: false
            });
        }
    }

    render() {
        const hide = !this.state.clicked;
        let mapping = null;
        let referenceStyle: React.CSSProperties = {};
        let clickCircle = null;
        if(this.state.references.length >= 2) {
            mapping = {
                long: (y: number) => {
                    let yDelta = this.state.references[0].y - this.state.references[1].y;
                    let longDelta = this.state.references[0].long - this.state.references[1].long;
                    let longPerY = longDelta / yDelta;
                    let curYDelta = y - this.state.references[0].y;
                    return this.state.references[0].long + (curYDelta * longPerY);
                },
                lat: (x: number) => {
                    let xDelta = this.state.references[0].x - this.state.references[1].x;
                    let latDelta = this.state.references[0].lat - this.state.references[1].lat;
                    let latPerX = latDelta / xDelta;
                    let curXDelta = x - this.state.references[0].x;
                    return this.state.references[0].lat + (curXDelta * latPerX);
                }
            } as Mapping
        }
        let persistent = this.state.references.map(ref => {
            const style = {
                top: `${ref.y - 5}px`,
                left: `${ref.x - 5}px`,
            } as React.CSSProperties
            return (
                <div className="persistent-reference" style={style}>
                    <div className="persistent-tooltip">
                        <p>Longitude: {ref.long}; Latitude: {ref.lat}</p>
                    </div>
                </div>
            )
        })
        if(this.state.clicked) {
            const style = {
                top: `${this.state.clickedPos.y - 5}px`,
                left: `${this.state.clickedPos.x - 5}px`,
            } as React.CSSProperties
            clickCircle = <div className="click-circle" style={style}></div>

            referenceStyle = {
                top: `${this.state.clickedPos.y + 15}px`,
                left: `${this.state.clickedPos.x - 30}px`,
            } as React.CSSProperties
        }
        return (
            <div>
                {clickCircle}
                {persistent}
                <div className='imgbox'>
                    <img 
                        className='center-fit' 
                        onMouseMove={this.onMouseMove.bind(this)}
                        onClick={this.onClick.bind(this)}
                        src={this.state.fileContents}
                    />
                </div>
                <div>
                    <Legend x={this.state.x} y={this.state.y} references={this.state.references} mapping={mapping}/>
                </div>
                <div className="reference-input" style={referenceStyle} hidden={hide}>
                    <label>Longitude
                        <input type="number" 
                            onChange={this.onLongitudeChange.bind(this)}
                            value={this.state.long ?? ""}></input>
                    </label>
                    <br></br>
                    <label>Latitude
                        <input type="number" 
                            onChange={this.onLatitudeChange.bind(this)}
                            onKeyDown={this.onKeydown.bind(this)}
                            value={this.state.lat ?? ""}
                            ></input>
                    </label>
                    <br></br>
                    <input type="submit" onClick={this.onCoordsSubmit.bind(this)}></input>
                </div>
            </div>
        )
    }
};
