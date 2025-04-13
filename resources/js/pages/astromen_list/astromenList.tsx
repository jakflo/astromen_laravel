import React, { Component } from 'react';

export default class AstromenList extends React.Component
{
    constructor(props) 
    {
        super(props);
//            this.state = {
//                
//            };
    }
    
    render()
    {
        var rows = [];
        var k;
        for (k in this.props.list) {
            let row = this.props.list[k];
            rows.push(<AstromenListRow key={k} rowNumber={k} rowData={row} />);
        }        
        
        return (		
            <>
                <table id="atromen_table" className="normTab">
                    <thead>
                        <tr>
                            <th>Jméno</th>
                            <th>Příjmení</th>
                            <th>Datum narození</th>
                            <th>Dovednosti</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </>
        );
    }
    
}

class AstromenListRow extends React.Component
{
    constructor(props) 
    {
        super(props);
//        this.state = {
//
//        };
    }
    
    render()
    {
	var toto = this;
        return (
            <>
                <tr>
                    <td>{this.props.rowData.first_name}</td>
                    <td>{this.props.rowData.last_name}</td>
                    <td>{this.props.rowData.dobCz}</td>
                    <td>{this.props.rowData.skill_names.join(', ')}</td>
                    <td>
                    <button type="button" data-id={this.props.rowNumber} onClick={() => {this.astromanEdited(toto)}}>Editovat</button>
                        <button type="button">Smazat</button>
                    </td>
                </tr>
            </>
        );
    }
    
    componentDidMount()
    {
        
    }
    
    astromanEdited(toto)
    {	
        var formEvent = new CustomEvent('astromanFormEditSetData', {detail:{data: toto.props.rowData}});
        document.dispatchEvent(formEvent);
    }    
    
}