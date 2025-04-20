import React, { Component } from 'react';
import Paginator from './paginator';

export default class AstromenList extends React.Component
{
    constructor(props) 
    {
        super(props);
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
                <Paginator links={this.props.paginator.links} />
            </>
        );
    }
    
}

class AstromenListRow extends React.Component
{
    constructor(props) 
    {
        super(props);
        this.state = {
            markedForEdit: false, 
            markedForDelete: false
        };
    }
    
    render()
    {
        if (this.state.markedForEdit) {
            var markedClassName = 'marked_edit';
        } else if (this.state.markedForDelete) {
            var markedClassName = 'marked_delete';
        } else {
            var markedClassName = '';
        }
        
        return (
            <>
                <tr className={markedClassName}>
                    <td>{this.props.rowData.first_name}</td>
                    <td>{this.props.rowData.last_name}</td>
                    <td>{this.props.rowData.dobCz}</td>
                    <td>{this.props.rowData.skill_names.join(', ')}</td>
                    <td>
                    <button type="button" data-id={this.props.rowNumber} onClick={() => {this.astromanEdited();}}>Editovat</button>
                    <button type="button" data-id={this.props.rowNumber} onClick={() => {this.astromanDeleted();}}>Smazat</button>
                    </td>
                </tr>
            </>
        );
    }
    
    componentDidMount()
    {
        var toto = this;
        document.addEventListener('unmarkRow', function(event) {
            toto.setState({
                markedForEdit: false, 
                markedForDelete: false
            });
        });
    }
    
    astromanEdited()
    {
        this.unmarkRows();
        this.setState({markedForEdit: true});
        var formEvent = new CustomEvent('astromanFormEditSetData', {detail:{data: this.props.rowData}});
        document.dispatchEvent(formEvent);
    }
    
    astromanDeleted()
    {
        this.unmarkRows();
        this.setState({markedForDelete: true});
        var hideNewAstromanAndEditFormEvent = new CustomEvent('hideNewAstromanAndEditForm');
        document.dispatchEvent(hideNewAstromanAndEditFormEvent);
        var formEvent = new CustomEvent('astromanFormDeleteSetData', {detail:{data: this.props.rowData}});
        document.dispatchEvent(formEvent);
    }
    
    unmarkRows()
    {
        var unmarkRowEvent = new CustomEvent('unmarkRow');
        document.dispatchEvent(unmarkRowEvent);
    }
    
}