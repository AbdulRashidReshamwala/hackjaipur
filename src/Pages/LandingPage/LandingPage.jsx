import React from "react";
import Button from '@material-ui/core/Button';

const LandingPage = () => {
  return (
    <div>
      <div className="landing-page">
        <div className="overlay">
          <div className="caption">
            <Button variant="contained" size="large" color="primary">
              GET STARTED
            </Button>
         </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage