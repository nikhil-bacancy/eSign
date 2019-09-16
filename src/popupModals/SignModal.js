import React from 'react';
import {
	TabContent, TabPane,
	Nav, NavItem, NavLink,
	Input, Button, Form, FormGroup, Row, Col, Label,
	Modal, ModalBody, ModalFooter, ModalHeader
} from 'reactstrap';
import SignatureCanvas from 'react-signature-canvas';
import './signModal.css'
import classnames from 'classnames';
import SignatureUpload from "../utils/dragNdropFileupload";
import { toastError } from "../NotificationToast";
import sampleSign from './sampleSign.png';
import Avatar from 'avatar-initials';
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
			this.setState({
				isSignChange: !this.props.open,
				signImg: this.props.signatureUrl,
			});
		}
		// var name = 'Foo Bar 1Name too Long';
		// var initials = name.match(/\b\w/g) || [];
		// initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();

		if (document.getElementById('avatarInitital')) {
			const avatarFullName = new Avatar(document.getElementById('avatarFullName'), {
				'useGravatar': false,
				'initials': 'Nikhil Patel',
				'initial_fg': 'black',
				'initial_size': 40,
				'initial_bg': '#ffffff00', // Transperent Background Color
				'initial_font_family': "'Tangerine', cursive",
			});

			const avatarInitital = new Avatar(document.getElementById('avatarInitital'), {
				'useGravatar': false,
				'initials': 'NP',
				'initial_fg': 'black',
				'initial_size': 40,
				'initial_bg': '#ffffff00', // Transperent Background Color
				'initial_font_family': "'Tangerine', cursive",
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
							<Row>
								<Col md={6}>
									<FormGroup>
										<Label for="exampleFullname">Full Name</Label>
										<Input type="text" name="fullName" id="exampleFullname" placeholder="Enter Name" />
									</FormGroup>
								</Col>
								<Col md={6}>
									<FormGroup>
										<Label for="exampleInitial">Initials</Label>
										<Input type="text" name="initial" id="exampleInitial" placeholder="Enter Initial" />
									</FormGroup>
								</Col>
							</Row>
							<hr />
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
										<NavItem>
											<NavLink
												style={{ cursor: "pointer" }}
												className={classnames({ active: activeTab === "3" })}
												onClick={() => { this.toggleTabs("3"); }}
											>CHOOSE</NavLink>
										</NavItem>
									</Nav>
								</Col>
							</Row>
							<Row>
								<Col md={12} >
									<TabContent activeTab={activeTab}>
										<TabPane tabId="1">
											<div className={"sigContainer"}>
												<SignatureCanvas ref={(ref) => { this.sigPad = ref }} penColor='black' canvasProps={{ width: 500, height: 150, className: "sigPad" }} clearOnResize={false} />
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
										<TabPane tabId="3">
											<div className={"chooseContainer"}>
												<div class="d-flex bg-white border rounded boxshadowEffect1">
													<div class="flex-shrink-1 align-self-center">
														<FormGroup check inline className="pl-2">
															<Input type="radio" name="finalizedrecipients" value={''} />
														</FormGroup>
													</div>
													<div class="w-100">
														<img src={sampleSign} id="avatarFullName" width={300} height={50} alt='nothing' />
													</div>
													<div class="flex-shrink-1">
														<img src={sampleSign} id="avatarInitital" width={100} height={50} alt='nothing' />
													</div>
												</div>
											</div>
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