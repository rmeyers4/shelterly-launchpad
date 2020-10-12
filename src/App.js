/* src/App.js */
import React from 'react'
import Amplify from 'aws-amplify'
import { withAuthenticator } from '@aws-amplify/ui-react'
import awsExports from "./aws-exports";
import IncidentList from "./components/IncidentList"
Amplify.configure(awsExports);


const App = () => {
  return (
    <div >
        <IncidentList/>
    </div>
  )
}


export default withAuthenticator(App)