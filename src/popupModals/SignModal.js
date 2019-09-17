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
import Signswithinitials from "./Signswithinitials";
class SignModal extends React.Component {
	constructor(props) {
		super(props);
		this.sigPad = {};
		this.sigInitialPad = {};
		this.state = {
			activeTab: "1",
			count: 5,
			signImg: null,
			initialImg: null,
			isSignChange: false,
			isInitialChange: false,
			userDetails: null,
		};
	}

	componentDidUpdate = (prevProps) => {
		let { userDetails, activeTab, count } = { ...this.state }
		if (prevProps.open !== this.props.open) {
			let name = this.props.userDetails.name;
			let initials = name.match(/\b\w/g) || [];
			initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
			userDetails = this.props.userDetails
			userDetails.initials = initials;
			this.setState({
				isSignChange: !this.props.open,
				isInitialChange: !this.props.open,
				signImg: this.props.signatureUrl,
				initialImg: this.props.initialUrl,
				userDetails,
			});
		}
		if (activeTab === '3' && document.getElementById('tab-3')) {
			let font_family_List = ["'Tangerine', cursive",
				"'Dancing Script', cursive", "Montez",
				"Mr De Haviland", "Pinyon Script"];
			for (let index = 0; index < count; index++) {
				let avatarFullName = `avatarFullName${index + 1}`;
				new Avatar(document.getElementById(avatarFullName), {
					'useGravatar': false,
					'initials': userDetails.name,
					'initial_fg': 'black',
					'initial_size': 30,
					'initial_bg': '#ffffff00',
					'initial_font_family': font_family_List[index],
				});
				let avatarInitital = `avatarInitital${index + 1}`;
				new Avatar(document.getElementById(avatarInitital), {
					'useGravatar': false,
					'initials': userDetails.initials,
					'initial_fg': 'black',
					'initial_size': 30,
					'initial_bg': '#ffffff00',
					'initial_font_family': font_family_List[index],
				});

			}
		}
	}

	onSetSign = () => {
		const { signImg, initialImg, isSignChange, isInitialChange, activeTab } = this.state;
		if (signImg && isSignChange) {
			if (initialImg && isInitialChange) {
				this.props.onUploadSign(signImg, initialImg);
			} else {
				if (activeTab === '1') {
					toastError("Please Draw / Apply Initial.!");
				} else if (activeTab === '2') {
					toastError("Please Upload Initial.!");
				}
			}
		}
		else {
			if (activeTab === '1') {
				toastError("Please Draw / Apply Signature.!");
			} else if (activeTab === '2') {
				toastError("Please Upload Signature.!");
			}
		}
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

	onCheckChanged = (event) => {
		let { signImg, initialImg } = { ...this.state };
		let seletedAvatarSignId = 'avatarFullName' + event.target.id.charAt(event.target.id.length - 1)
		let seletedAvatarInitialId = 'avatarInitital' + event.target.id.charAt(event.target.id.length - 1)
		signImg = document.getElementById(seletedAvatarSignId).getAttribute('src');
		initialImg = document.getElementById(seletedAvatarInitialId).getAttribute('src');
		this.setState({
			signImg,
			initialImg,
			isSignChange: true,
			isInitialChange: true,
		});
	}

	render() {
		const { signImg, initialImg, isSignChange, isInitialChange, activeTab, userDetails, count } = this.state;
		return (
			<div>
				<Modal size={"md"} isOpen={this.props.open}>
					<ModalHeader toggle={this.props.toggle}	>Signature Selection</ModalHeader>
					<ModalBody style={{ backgroundColor: "whitesmoke" }}>
						<Form>
							<Row className={"mb-3"} style={{ borderBottom: '1px solid gainsboro' }}>
								<Col md={6}>
									<FormGroup>
										<Label for="exampleFullname">Full Name</Label>
										<Input type="text" name="fullName" id="exampleFullname" readOnly value={userDetails && userDetails.name} placeholder="Enter Name" />
									</FormGroup>
								</Col>
								<Col md={6}>
									<FormGroup>
										<Label for="exampleInitial">Initials</Label>
										<Input type="text" name="initial" id="exampleInitial" readOnly value={userDetails && userDetails.initials} placeholder="Enter Initial" />
									</FormGroup>
								</Col>
							</Row>
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
											<Row className={'m-0'}>
												<Col sm="8" className={"sigContainer"}>
													<SignatureCanvas ref={(ref) => { this.sigPad = ref }} penColor='black' canvasProps={{ width: 300, height: 150, className: "sigPad" }} clearOnResize={false} />
												</Col>
												<Col sm="4" className={"sigInitialContainer"}>
													<SignatureCanvas ref={(ref) => { this.sigInitialPad = ref }} penColor='black' canvasProps={{ width: 200, height: 150, className: "sigPad" }} clearOnResize={false} />
												</Col>
											</Row>
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
										<TabPane tabId="3" id='tab-3'>
											<Col className={"chooseContainer"}>
												<Row className="m-1 d-flex align-items-center">
													<Col xs="4"></Col>
													<Col xs="6" className="align-self-center">
														<Label readOnly>Signature</Label>
													</Col>
													<Col xs="2">
														<Label readOnly >Initials</Label>
													</Col>
												</Row>
												<Row className="m-1 d-flex align-items-center overflow-auto" style={{ height: '180px' }}>
													<Signswithinitials count={count} onCheckChanged={this.onCheckChanged} sampleSign={sampleSign} />
												</Row>
											</Col>
										</TabPane>
									</TabContent>
								</Col>
							</Row>
							{signImg ?
								<Row>
									<Col md={6} className={"pt-2"}>
										<Label for="exampleInitial">Your Signature : </Label>
										<FormGroup>
											<img className={"sigImage border border-secondary"} alt="signature" src={signImg} />
										</FormGroup>
									</Col>
									<Col md={6} className={"pt-2"}>
										<Label for="exampleInitial">Your Signature : </Label>
										<FormGroup>
											<img className={"initialImage border border-secondary"} alt="signature" src={initialImg} />
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
						<Button color="success" disabled={!(isSignChange && isInitialChange)} onClick={this.onSetSign}>Set Sign</Button>
					</ModalFooter>
				</Modal>
			</div>
		)
	}
}

export default SignModal;