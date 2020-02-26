import React from 'react';
import PropTypes from "prop-types"

export default class CustomFooter extends React.Component {
	static propTypes = {
		specSelectors: PropTypes.object.isRequired
	}

	render() {
		let { specSelectors } = this.props
		let url = specSelectors.url()
		return (
			<div className='footer'>
				<div className='url'>
					URL: {url}, Versão da API: v1
				</div>
				<h2>Como utilizar esta documentação?</h2>
				<p>Certifique-se que sua chave da API está preenchida no topo desta
					página para este recurso funcionar da maneira correta. Acima você poderá
					conferir a lista de recursos que podem ser manipulados através da API
					Vindi. Cada recurso possui uma série de métodos, como criar e atualizar.
					Clicando em cada um dos métodos, você poderá verificar a lista de parâmetros,
					possíveis retornos e também um formulário. Este formulário pode ser utilizado
			para efetuar requisições reais na API.</p>
			</div>
		)
	}

	static propTypes = {
		specSelectors: PropTypes.object.isRequired
	}
}
