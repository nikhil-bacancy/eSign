const nodemailer = require("nodemailer");

exports.sendEMail = (from, to, subject, bodyText, bodyHtml, attachments) => {
	return new Promise((resolve, reject) => {
		let transporter = nodemailer.createTransport({
			// service: "Gmail",
			host: "smtp.gmail.com",
			port: 465,
			secure: true,
			auth: {
				user: process.env.EMAIL,
				pass: process.env.PASSWORD
			}
		});

		let mailOptions = {
			from: `"Esign"<${from}>`, // sender address
			to, // list of receivers
			subject, // Subject line
			text: bodyText && bodyText, // plain text body
			html: bodyHtml && bodyHtml, // html body
			attachments,
			// attachments: [{
			// 	filename: 'Esign.png',
			// 	path: __dirname + '/images/Esign.png',
			// 	cid: 'esing@logo' //same cid value as in the html img src
			// }, {
			// 	filename: 'symbol.png',
			// 	path: __dirname + '/images/symbol.png',
			// 	cid: 'symbol@logo' //same cid value as in the html img src
			// }],
		}

		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				reject({
					status: false,
					message: 'Mail can not sent.',
					details: error,
				})
			} else {
				resolve({
					status: true,
					message: 'Mail Sent.',
					details: info.response,
				})
			}
		});
	});
}

exports.setSignatureEMailBodyHtml = (sender, receiver, link, task) => {
	return (`
  <div id=":12c" class="a3s aXjCH ">
	<div style="background-color:#eaeaea;padding:2%;font-family:Helvetica,Arial,Sans Serif"><img style="display:none">
		<table role="presentation" border="0" cellspacing="0" cellpadding="0" align="center" width="100%" dir="">
			<tbody>
				<tr>
					<td></td>
					<td width="640">
						<table style="border-collapse:collapse;background-color:#ffffff;max-width:640px">
							<tbody>
								<tr>
									<td style="padding:10px 24px"><img style="border:none" width="116" src="cid:esing@logo" alt="Esign"
											class="CToWUd"></td>
								</tr>
								<tr>
									<td style="padding:0px 24px 30px 24px">
										<table role="presentation" border="0" cellspacing="0" cellpadding="0" width="100%" align="center"
											style="background-color:#1e4ca1;color:#ffffff">
											<tbody>
												<tr>
													<td
														style="padding:28px 36px 36px 36px;border-radius:2px;background-color:#0072A1;color:#ffffff;font-size:16px;font-family:Helvetica,Arial,Sans Serif;width:100%;text-align:center"
														align="center"><img width="75" height="75" src="cid:symbol@logo" style="width:75px;height:75px"
															class="CToWUd">
														<table role="presentation" border="0" cellspacing="0" cellpadding="0" width="100%">
															<tbody>
																<tr>
																	<td
																		style="padding-top:24px;font-size:16px;font-family:Helvetica,Arial,Sans Serif;border:none;text-align:center;color:#ffffff"
																		align="center"> ${ (task === 'setSign') ? sender.name + 'sent you a document to review and sign.' : 'Entire document has been signed and ready to review. '}  </td>
																</tr >
															</tbody >
														</table >
		<table role="presentation" border="0" cellspacing="0" cellpadding="0" width="100%">
			<tbody>
				<tr>
					<td align="center" style="padding-top:30px">
						<div>
							<table cellspacing="0" cellpadding="0">
								<tbody>
									<tr>
										<td align="center" height="44"
											style="font-size:15px;color:#333333;background-color:#ffc423;font-family:Helvetica,Arial,Sans Serif;font-weight:bold;text-align:center;text-decoration:none;border-radius:2px;background-color:#ffc423;display:block">
											<a href=${link}
												style="font-size:15px;color:#333333;background-color:#ffc423;font-family:Helvetica,Arial,Sans Serif;font-weight:bold;text-align:center;text-decoration:none;border-radius:2px;background-color:#ffc423;display:inline-block"
												target="_blank"><span style="padding:0px 24px;line-height:44px">
													REVIEW DOCUMENT
																							</span></a></td>
									</tr>
								</tbody>
							</table>
						</div>
					</td>
				</tr>
			</tbody>
		</table>
													</td >
												</tr >
											</tbody >
										</table >
									</td >
								</tr >
		<tr>
			<td
				style="padding:0px 24px 24px 24px;color:#000000;font-size:16px;font-family:Helvetica,Arial,Sans Serif;background-color:white">
				${(task === 'setSign') ?
			`<table role="presentation" border="0" cellspacing="0" cellpadding="0">
										<tbody>
											<tr>
												<td style="padding-bottom:20px">
													<div
														style="font-family:monospace;line-height:18px;font-size:15px;color:#333333;font-size:large;">
														${sender.name} </div>
													<div
														style="font-family:Helvetica,Arial,Sans Serif;line-height:18px;font-size:15px;color:#666666">
														<a href="mailto:${sender.email}"
															target="_blank">${sender.email}</a>
													</div>
												</td>
											</tr>
										</tbody>
									</table>`
			:
			''
		}
				<span style="font-family:monospace;font-size:14px;color:#333333;font-size: large;line-height:20px">${(receiver.label) ? receiver.label + '<br/><br/>, ' : ''}Please <span class="il">Sign/Review</span>
						The Document That Is Shared Through Esign.<br><br> Thank You, ${sender.name}
                    </span><br>
                  </td>
                </tr>
						<hr />
						<tr>
							<td style="padding:0px 24px 15px 24px;">
								<p style="margin-bottom:1em;font-family:Helvetica,Arial,Sans Serif;font-size:13px;color:#666666;line-height:18px">
									<b>Do Not Share This Email</b>
									<br> This email contains a secure link to
                      <span class="il">DocuSign</span>. Please do not share this email, link, or access code with others.<br>
                    </p>
                  </td>
                </tr>
								<hr />
								<tr>
									<td
										style="padding:0px 24px 12px 24px;background-color:#ffffff;font-family:monospace;font-size: large;font-size:11px;color:#666666">
									</td>
								</tr>
							</tbody>
						</table>
					</td>
						<td></td>
				</tr>
			</tbody>
		</table>
			<div class="yj6qo"></div>
			<div class="adL"><span><span><span></span></span></span></div>
	</div>
</div >
		`)
}