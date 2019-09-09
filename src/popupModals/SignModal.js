import React from 'react';
import {
	TabContent, TabPane,
	Nav, NavItem, NavLink,
	Button, Form, FormGroup, Row, Col, Label,
	Modal, ModalBody, ModalFooter, ModalHeader
} from 'reactstrap';
import SignatureCanvas from 'react-signature-canvas';
import './signModal.css'
import classnames from 'classnames';
import SignatureUpload from "../utils/dragNdropFileupload";
import { toastError } from "../NotificationToast";

class SignModal extends React.Component {
	constructor(props) {
		super(props);
		this.sigPad = {};
		this.state = {
			activeTab: "1",
			signImg: null,
			isSignChange: false,
		};
	}

	componentDidUpdate = (prevProps) => {
		if (prevProps.open !== this.props.open) {
			console.log("etfsdfsdg"
			)
			this.setState({
				isSignChange: !this.props.open,
				signImg: this.props.signatureUrl,
			});
		}

	}

	onSetSign = () => {
		const { signImg, isSignChange } = this.state;
		if (signImg && isSignChange)
			this.props.onUploadSign(signImg);
		else
			toastError("Please Draw / Save Signature.!");
	}

	toggleTabs = (tab) => {
		if (this.state.activeTab !== tab) {
			this.setState({
				activeTab: tab
			});
		}
	}

	clear = () => {
		this.sigPad.clear()
	}

	trim = () => {
		if (this.sigPad.isEmpty()) {
			toastError("Please Draw Signature.!");
		} else {
			this.setState({
				signImg: this.sigPad.getTrimmedCanvas().toDataURL('image/png'),
				isSignChange: true,
			})
		}
	}

	onFileDrop = (file) => {
		const promise = new Promise((resolve, reject) => {
			const reader = new FileReader()
			reader.readAsDataURL(file)
			reader.onload = () => {
				if (!!reader.result) {
					resolve(reader.result)
				}
				else {
					reject(Error("Failed converting to base64"))
				}
			}
		})
		promise.then(result => {
			this.setState({
				isSignChange: true,
				signImg: result,
			})
		}, err => {
			toastError("Invalid Image")
		})
	}

	render() {
		const { signImg, isSignChange, activeTab } = this.state;
		return (
			<div>
				<Modal size={"md"} isOpen={this.props.open}>
					<ModalHeader toggle={this.props.toggle}	>Signature Selection</ModalHeader>
					<ModalBody style={{ backgroundColor: "whitesmoke" }}>
						<Form>
							{/* <Row>
								<Col md={6}>
									<FormGroup>
										<Label for="exampleFullname">Full Name</Label>
										<Input type="text" name="fullName" id="exampleFullname" placeholder="Your Full Name Here." />
									</FormGroup>
								</Col>
								<Col md={6}>
									<FormGroup>
										<Label for="exampleInitial">Initials</Label>
										<Input type="text" name="initial" id="exampleInitial" placeholder="Initial As Per Fullname" />
									</FormGroup>
								</Col>
							</Row> */}
							<Row>
								<Col md={12} >
									<Nav tabs>
										<NavItem>
											<NavLink
												style={{ cursor: "pointer" }}
												className={classnames({ active: activeTab === "1" })}
												onClick={() => { this.toggleTabs("1"); }}
											>DRAW</NavLink>
										</NavItem>
										<NavItem>
											<NavLink
												style={{ cursor: "pointer" }}
												className={classnames({ active: activeTab === "2" })}
												onClick={() => { this.toggleTabs("2"); }}
											>UPLOAD</NavLink>
										</NavItem>
									</Nav>
								</Col>
							</Row>
							<Row>
								<Col md={12} >
									<TabContent activeTab={activeTab}>
										<TabPane tabId="1">
											<div className={"sigContainer"}>
												<SignatureCanvas ref={(ref) => { this.sigPad = ref }} penColor='black' canvasProps={{ className: "sigPad" }} clearOnResize={false} />
											</div>
											<div>
												<Button color="warning" onClick={this.clear}>Clear</Button>{' '}
												<Button color="primary" onClick={this.trim}>Apply</Button>{' '}
											</div>
										</TabPane>
										<TabPane tabId="2">
											<Row>
												<Col sm="12">
													<SignatureUpload onFileDrop={this.onFileDrop} showFileMeta={false} />
												</Col>
											</Row>
										</TabPane>
									</TabContent>
								</Col>
							</Row>
							{signImg ?
								<Row>
									<Col md={12} className={"pt-2"}>
										<Label for="exampleInitial">Your Signature : </Label>
										<FormGroup>
											<img className={"sigImage border border-secondary"} alt="signature" src={signImg} />
										</FormGroup>
									</Col>
								</Row>
								:
								null
							}
						</Form>
					</ModalBody>
					<ModalFooter>
						<Button color="primary" onClick={this.props.toggle}>Close</Button>
						<Button color="success" disabled={!isSignChange} onClick={this.onSetSign}>Set Sign</Button>
					</ModalFooter>
				</Modal>
			</div>
		)
	}
}

export default SignModal;