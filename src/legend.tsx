import React from 'react';
import ReactDOM from 'react-dom';
import ReactToolTip from 'react-tooltip';
import './legend.css'

interface ILegendProps {
    x: number;
    y: number;
    mapping: Mapping | null;
    references: PointReference[]
};

export type Mapping = {
    long: (y: number) => number,
    lat: (x: number) => number
}

export type PointReference = {
    x: number;
    y: number;
    long: number;
    lat: number;
}

interface ILegendState {
};

export class Legend extends React.Component<ILegendProps, ILegendState> {

    render() {
        let map = null;
        const references = [] as any;
        this.props.references.forEach(element => {
            references.push(<p>long: {element.long}; lat: {element.lat}</p>);
        });
        if(this.props.mapping !== null) {
            map = <span>Longitude: {this.props.mapping.long(this.props.y)}; Latitude: {this.props.mapping.lat(this.props.x)}</span>
        }

        return (
            <div className="legend">
                <p>Legend</p>
                <span>Y: {this.props.y}; X: {this.props.x}</span> {map}
                {references}
            </div>
        );
    }
}