import { useEffect, useState, useRef, } from 'react';
import Swal from 'sweetalert2'
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './FormContact.css';

const FormContact = () => {
	const SITE_KEY = "6LdaRiEjAAAAAKnQ5xOu9WsUlvvoPeAONCUNsu9N";
	const ENDPOINT = "/endpoint.php";
	const [ formStatus, setFormStatus ] = useState( 'Enviar mensaje' );
	const [ total, setTotal ] = useState( 0 );
	const button = useRef();

	const request = ( data ) => {
		// ================================================================================
		// Request HTTP
		// ================================================================================
		try {;
			Swal.fire( {
				"allowOutsideClick": false,
				"text": "Espere un momento por favor.",
				"title": "Enviando mensaje ...",
			} )
			Swal.showLoading();

			fetch( ENDPOINT, {
				"body": JSON.stringify( data ),
				"headers": {
					"Accept": "application/json",
					"Content-Type": "application/json",
				},
				"method": "POST",
			} )
			.then( function( response ) {
				Swal.close();
				button.current.disabled = false;
				setFormStatus( 'Enviar mensaje' );

				if( response.ok ) {
					return response.json()
				}	// end if
				else {
					throw new Error( "Ajax call error." );
				}	// end else
			} )
			.then( function( response ) {
				// console.log( response );

				if( response.status === 'success' ) {
					// Clean form

					Swal.fire( {
						"confirmButtonText": "Accept",
						"icon": "success",
						"text": "Mensaje enviado correctamente.",
						"title": "Éxito",
					} );
				}	// end if
				else
					Swal.fire( {
						"confirmButtonText": "Accept",
						"icon": "error",
						"text": "Hubo un error al realizar la operación, por favor inténtalo de nuevo más tarde.",
						"title": "Error",
					} );
			} )
			.catch( function( err ) {
				// console.log( err );
				Swal.fire( {
					"confirmButtonText": "Accept",
					"icon": "error",
					"text": "No se pudo completar la solicitud técnica, por favor inténtalo de nuevo más tarde.",
					"title": "Error",
				} );
			} );
		}	// end try
		catch( error ) {
			console.error( error );
		}	// end try
		// ================================================================================
	};	// end function

	const onSubmit = ( event ) => {
		event.preventDefault();

		setFormStatus( 'Enviando...' );
		button.current.disabled = true;

		const { name, email, tel, message } = event.target.elements;

		let data = {
			name: name.value,
			email: email.value,
			tel: tel.value,
			message: message.value,
		};

		// console.log( data );

		window.grecaptcha.ready( () => {
			window.grecaptcha.execute( SITE_KEY, { "action": "submit" } ).then( token => {
				data[ "g-recaptcha-response" ] = token;
				request( data );
			} );
		} );
	};	// end function

	const onChange = ( event ) => {
		const { value } = event.target;
		setTotal( value.length );
	};	// end function
	
	useEffect( () => {
		// ReCaptcha
		const loadScriptByURL = ( id, url, callback ) => {
			const isScriptExist = document.getElementById( id );
			
			if ( ! isScriptExist ) {
				var script = document.createElement( "script" );
				script.id = id;
				script.onload = function () {
					if( callback )
						callback();
				};
				script.src = url;
				script.type = "text/javascript";
				document.body.appendChild( script );
			}
		
			if( isScriptExist && callback )
				callback();
		}	// end function
		
		// load the script by passing the URL
		loadScriptByURL(
			"recaptcha-key",
			`https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`,
			() => {
				console.log("Script loaded!");
			}
		);
	}, [] );	// end useEffect

	return (
		<div className="FormContact container mt-5">
			<h2 className="mb-3">Contacto</h2>

			<form onSubmit={onSubmit}>
				<div className="row">
					<div className="col-lg-6 col-12">
						<div className="mb-3">
							<label className="form-label" htmlFor="name">
								Nombre: *
							</label>
							<input id="name" className="form-control" placeholder="Nombre" required="required" type="text" />
						</div>
					</div>
					<div className="col-lg-6 col-12">
						<div className="mb-3">
							<label className="form-label" htmlFor="email">
								Correo electrónico: *
							</label>
							<input id="email" className="form-control" placeholder="Correo electrónico" required="required" type="email" />
						</div>
					</div>
				</div>

				<div className="mb-3">
					<label className="form-label" htmlFor="tel">
						Teléfono: *
					</label>
					<input id="tel" className="form-control" placeholder="Teléfono" required="required" type="tel" />
				</div>

				<div className="mb-3">
					<p>{total} de 500 caracteres.</p>
				</div>

				<div className="mb-3">
					<label className="form-label" htmlFor="message">
						Mensaje: *
					</label>
					<textarea id="message" className="form-control" onChange={onChange} maxLength="500" placeholder="Mensaje (Mínimo 10 caracteres)" required="required" rows="5"></textarea>
				</div>

				<div className="form-check">
					<input id="privacy" className="form-check-input" required="required" type="checkbox" value="" />
					<label className="form-check-label" htmlFor="privacy">
						Acepto las condiciones del servicio y la <a href="https://ferrebanos.com.mx/file/aviso-de-privacidad.pdf">política de privacidad</a> de esta página.
					</label>
				</div>

				<br />

				<div className="d-md-flex justify-content-md-end">
					<button className="btn btn-outline-primary" ref={button} type="submit">{formStatus}</button>
				</div>
			</form>
		</div>
	);
}	// end function

export default FormContact;