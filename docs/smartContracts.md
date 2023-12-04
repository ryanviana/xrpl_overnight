## 👩‍💻 Contratos inteligentes
Nesta página, serão documentados os contratos inteligentes e suas respectivas principais funções para o funcionamento do sistema. O projeto a seguir envolve não apenas a plataforma de crédito on-chain, mas também a tokenização do Real e de títulos do TFPt, que utilizam contratos inteligentes de oráculos da Chainlink para obter os dados da Taxa Selic através da [API do Banco Central](https://api.bcb.gov.br/dados/serie/bcdata.sgs.11/dados?formato=json).

### Nosso diferencial 
O principal diferencial da nossa aplicação nos contratos inteligentes é que desenvolvemos uma **solução realista**, que considera que cada usuário tenha uma wallet atrelada a uma instituição financeira e a wallet da instituição financeira interage com o contrato inteligente para efetuar as operações. Acreditamos que, no contexto atual, seria inocência considerar que o usuário médio realizaria a própria custódia e efetuasse com as próprias mãos suas transações on-chain. Além disso, ao tokenizar o TFPt, desenvolvemos um oráculo para que o mesmo tenha acesso às taxas Selic diárias para calcular a valorização do ativo ao longo do tempo conforme as variações da Selic.


### 1) Real Tokenizado (RealTokenizado.sol)

Contrato inteligente desenvolvido no padrão ERC-20 para simular o Real Tokenizado. Além das funções essenciais do ERC-20, também foram desenvolvidas as seguintes features:

**1.1) privilegedAccounts:** permissionamento para que somente os endereços de instituições financeiras, Banco Central e serviços do governo tenham acesso a essas funções. Dessa forma, cabe ao Banco Central chamar a função addPrivilegedAccount para permitir que uma nova instituição financeira possa operar com o Real Tokenizado.

**1.2) privilegedTransfer:** função desenvolvida para que bancos tenham acesso para transferir os tokens do Real Tokenizado das wallets de clientes e usuários.

**1.3) myntUser e burnUser:** função desenvolvida para que instituições financeiras e o Banco Central tenham acesso a mintar e fazer o burn de tokens de seus clientes. Por exemplo, um usuário tem R$1000 em Real Tokenizado e deseja sacar esse dinheiro em moeda física na agência do banco. Então, o banco pode realizar o burn desses tokens e efetuar o pagamento pessoalmente para o cliente.

 ### 2) Tesouro Federal Público Tokenizado (TFPt.sol)
 
Contrato inteligente para tokenização dos títulos do Tesouro Nacional. Também desenvolvido com o padrão ERC-20, mas esse contrato apresenta maior complexidade e segue abaixo as principais features:

**2.1) Privileged Accounts:** toda a lógica já explicado anteriormente.

**2.2) Variáveis e Constructor:** deve ser realizado o deploy desse contrato para emitir um título do Tesouro Nacional tokenizado. Ao efetuar o deploy, é necessário que você passe no constructor algumas variáveis relevantes como o nome do título, símbolo, quantia máxima de tokens a serem emitidos, preço inicial unitário, data de vencimento, investimento mínimo, tipo de ativo e o endereço do Real Tokenizado. Neste contrato, estamos considerando a tokenização de um título de Tesouro Selic, o qual rende conforme a variação da Taxa Selic.

**2.3) getTokenPrice:** função responsável por calcular o preço do ativo no momento atual. Para isso, é utilizada uma implementação da ferramenta Chainlink Functions para o contrato inteligente acessar uma API que irá considerar a taxa Selic diária desde o deploy do ativo e calcular o preço do token no momento em questão. Essa aplicação permite que calculemos o preço do ativo considerando as variações da Taxa Selic ao invés de desenvolver uma solução simplista com um valor arbitrário pré-fixado. Para isso, somamos o preço inicial do ativo (initialTokenPrice) com o quanto ele rendeu no período (IComputeProfit(computeProfitContract).profit()).

**2.3) invest:** função a qual o banco/instituição financeira deve chamar para que seja efetuado um investimento on-chain nesse título por parte de algum dos seus clientes. A função irá receber o valor do aporte do indivíduo, verificar se é superior ao investimento mínimo, receber o Real Tokenizado da carteira do usuário referente ao investimento, enviar os tokens do TPFt com base no preço do ativo no momento e listar o investidor na lista de investidores daquele ativo. Caso o investidor já esteja listado, ele não será adicionado novamente.

**2.4) withdrawInvestor:** função utilizada para a instituição financeira realizar a liquidação dos títulos de um investidor. Nessa função, é realizado o mecanismo contrário da função invest: o contrato inteligente recebe o número de tokens TPFt da carteira do usuário e paga o investidor com o Real Tokenizado com base no preço do ativo no momento.

**2.5) withdrawBacen:** função utilizada para o Banco Central receber os tokens de Real Tokenizado de todos os investimentos efetuados naquele título

 ### 3) Credpix (Credpix.sol)

 O Credpix é a implementação em contratos inteligentes do nosso mecanismo de crédito colateralizado com o Real Tokenizado. Esse contrato não apenas serve para o usuário obter crédito colateralizado, mas também para que as parcelas de crédito sejam pagas. Além disso, foi desenvolvido um mecanismo que permite que o usuário efetue um resgate parcial do colateral conforme sejam pagas as parcelas (sempre garantindo que o colateral seja superior ao débito com o credor).

**3.1) mapping(address => mapping(address => uint256)) public debt:** quantia que o devedor deve àquela instituição financeira;

**3.2) mapping(address => mapping(address => uint256)) public collateral:** quantia que o devedor tem como colateral para a instituição financeira em questão;

**3.3) creditOperation:** função para que seja efetuada uma operação de crédito. A instituição financeira (credor) deve chamar essa função informando a wallet do investidor, endereço do título para colateral e quantia de crédito. Essa mesma função realiza a transação de Real Tokenizado da IF para o usuário e a transação do colateral para o próprio contrato. Além disso, é efetuado um registro e atualização do saldo devedor e do colateral do investidor no contrato.

**3.4) payCreditor:** função a ser utilizada para efetuar o pagamento de uma parcela de crédito

**3.5) getCollateralBack:** função utilizada para que o usuário realize o saque da parcela do colateral referente aos pagamentos já efetuados.


 ### 4) SelicOracle (SelicOracle.sol) e ComputeProfitRefactored (ComputeProfitRefactored.sol)
Esses contratos são responsáveis por efetuar a lógica de rentabilidade do ativo ao longo do tempo conforme as variações da Taxa Selic. Para isso, é utilizada a ferramenta do Chainlink Functions, a qual permite o acesso à API de Taxa Selic do Banco Central (SelicOracle.sol) e a execução de um código em Javascript (string source) no ComputeProfitRefactored.sol.

**4.1) sendRequest (em SelicOracle.sol)**: deve-se passar o subscriptionId (970) e uma array com um intervalo entre duas datas como string. Por exemplo, se você quer obter as taxas Selic diárias de 2021, você deve passar o seguinte argumento: ["01/01/2021", "31/12/2021"]. Assim, o contrato irá retornar uma array com todas as taxas desse período;

**4.2) computeProfit (SelicOracle.sol):** cálculo da rentabilidade do ativo durante o período e esse dado é salvo na variável uint256 public profit. Dessa forma, no contrato inteligente do TFPt, é calculado o valor atual do ativo através da soma do valor inicial com o profit.

 ### 5) IComputeProfit (IComputeProfit.sol)
Interface utilizada para interagir com as funções do contrato inteligente ComputeProfitRefactored. Essa interface é utilizada no contrato TFPt.sol e SelicOracle.sol.

### 6) Math (math.sol)
Contrato inteligente da biblioteca DSMath para cálculos matemáticos em Solidity.

