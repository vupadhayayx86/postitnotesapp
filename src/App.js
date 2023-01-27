import React, { useReducer, useState } from 'react';
import {v4 as uuid} from 'uuid'
const initialNotesState={
    lastNoteCreated:null,
    totalNotes:0,
    notes:[],
}

const notesReducer=(prevState,action)=>{
    switch(action.type){
        case 'ADD_NOTE':{
            const newState={
                lastNoteCreated:new Date().toTimeString().slice(0,8),
                totalNotes:prevState.notes.length+1,
                notes:[...prevState.notes,action.payload]
            };
            console.log(newState)
            return newState;
        }
        case 'DELETE_NOTE':{
            const newState={
                ...prevState,
                totalNotes:prevState.notes.length-1,
                notes:prevState.notes.filter(note=>note.id!==action.payload.id)
                //The filter function will create a new note object with all the ids that passed the test.
                //We are testing if id is not equal. The id will be equal for only the note that is clicked.
            }
            return newState;
        }
    }
}


export function App() {
    const [noteInput,setNoteInput]=useState('')
    //Use reducer takes reducer function and initial state as a parameter and returns state and dispatch function
    //notesState is a global reducer state for this component.
    const [notesState,dispatch]=useReducer(notesReducer,initialNotesState)

    const dragNote=(e)=>{
        e.stopPropagation()
        e.preventDefault()

    }
    const dropNote=(e)=>{
        e.target.style.left=`${e.pageX-50}px`
        e.target.style.top=`${e.pageY-50}px`
    }

    const addNote=(e)=>{
        e.preventDefault();
        if(!noteInput){
            //return if noteInput is empty
            return;
        }
        const newNote={
            id:uuid(),
            text:noteInput,
            rotate:Math.floor(Math.random()*20)
        };
        dispatch({type:'ADD_NOTE',payload:newNote})
        setNoteInput('')
    }
    return (
        <div className="app" onDragOver={dragNote}>
            <h1>
                Sticky Notes
            </h1>
            <form onSubmit={addNote} className="note-form">
                <textarea value={noteInput} onChange={(e)=>setNoteInput(e.target.value)} placeholder='Create a new Note....'></textarea>
                <button>Add</button>
            </form>
            {notesState.notes.map((note)=>(
                <div key={note.id} className="note" style={{transform:`rotate(${note.rotate}deg)`}}
                draggable="true"
                onDragEnd={dropNote}
                
                >
                    <div className='close' onClick={(e)=>dispatch({type:"DELETE_NOTE",payload:note})}><b>X</b></div>
                    <pre className="text">
                        {note.text}
                    </pre>
                </div>
            ))
            
            
            }
        </div>
    );
}