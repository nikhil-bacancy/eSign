import React from 'react'
import {
    Input, FormGroup, Row, Col,
} from 'reactstrap';
const Signswithinitials = (props) => {
    let chooseArr = [];
    for (let index = 0; index < props.count; index++) {
        chooseArr.push(<Row key={`choose${index + 1}`} className="m-1 d-flex align-items-center bg-white border rounded boxshadowEffect1">
            <Col xs="1" className="align-self-center">
                <FormGroup check inline>
                    <Input type="radio" id={`selectsign${index + 1}`} onChange={props.onCheckChanged} name="finalizedrecipients" value={''} />
                </FormGroup>
            </Col>
            <Col xs="8">
                <img src={props.sampleSign} id={`avatarFullName${index + 1}`} width={300} height={50} alt='nothing' />
            </Col>
            <Col xs="3">
                <img src={props.sampleSign} id={`avatarInitital${index + 1}`} width={90} height={50} alt='nothing' />
            </Col>
        </Row>)
    }
    return (chooseArr);
}

export default Signswithinitials
