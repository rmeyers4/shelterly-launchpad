/* src/App.js */
import React, { useEffect, useState } from 'react'
import Amplify, { API, graphqlOperation } from 'aws-amplify'
import { createIncident } from '../graphql/mutations'
import { listIncidents } from '../graphql/queries'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import awsExports from "../aws-exports";
Amplify.configure(awsExports);

const initialState = { name: '', description: '' }

export default function IncidentList(){
  const [formState, setFormState] = useState(initialState)
  const [incidents, setIncidents] = useState([])

  useEffect(() => {
    fetchIncidents()
  }, [])

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value })
  }

  async function fetchIncidents() {
    try {
      const incidentData = await API.graphql(graphqlOperation(listIncidents))
      const incidents = incidentData.data.listIncidents.items
      setIncidents(incidents)
    } catch (err) { console.log(err) }
  }

  async function addIncident() {
    try {
      if (!formState.name || !formState.date_started) return
      const incident = { ...formState }
      setIncidents([...incidents, incident])
      setFormState(initialState)
      await API.graphql(graphqlOperation(createIncident, {input: incident}))
    } catch (err) {
      console.log('error creating incident:', err)
    }
  }

  return (
    <div >
      <Form>
      <Form.Group controlId="formName"
        onChange={event => setInput('name', event.target.value)}
        value={formState.name} 
        placeholder="Name"
      >
          <Form.Label>Name</Form.Label>
          <Form.Control placeholder="Incident Name"></Form.Control>
    </Form.Group>
      <Form.Group controlId="formDateStarted"></Form.Group>
      <input
        onChange={event => setInput('date_started', event.target.value)}
        value={formState.date_started}
        placeholder="Start Date"
      />
      <Button onClick={addIncident}>Start Incident</Button>
      {
        incidents.map((incident, index) => (
          <div key={incident.id ? incident.id : index}>
            <p>{incident.name}</p>
            <p>{incident.date_started}</p>
          </div>
        ))
      }
      </Form>
    </div>
  )
}
