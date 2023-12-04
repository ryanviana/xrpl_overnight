## Contratos inteligentes 

### 1) Real Tokenizado

Contrato inteligente desenvolvido no padrão ERC-20 para simular o Real Tokenizado. Além das funções essenciais do ERC-20, também foram desenvolvidas as seguintes features:

**1.1) privilegedAccounts:** permissionamento para que somente os endereços de instituições financeiras, Banco Central e serviços do governo tenham acesso a essas funções. Dessa forma, cabe ao Banco Central chamar a função addPrivilegedAccount para permitir que uma nova instituição financeira possa operar com o Real Tokenizado.

**1.2) privilegedTransfer:** função desenvolvida para que bancos tenham acesso para transferir os tokens do Real Tokenizado das wallets de clientes e usuários.

**1.3) myntUser e burnUser:** função desenvolvida para que instituições financeiras e o Banco Central tenham acesso a mintar e fazer o burn de tokens de seus clientes. Por exemplo, um usuário tem R$1000 em Real Tokenizado e deseja sacar esse dinheiro em moeda física na agência do banco. Então, o banco pode realizar o burn desses tokens e efetuar o pagamento pessoalmente para o cliente.

 ### 2) Tesouro Federal Público Tokenizado (TFPt)
 
Contrato inteligente para tokenização dos títulos do Tesouro Nacional. Também desenvolvido com o padrão ERC-20, mas esse contrato apresenta maior complexidade e segue abaixo as principais features:

**2.1) Privileged Accounts:** toda a lógica já explicado anteriormente.

**2.2) Variáveis e Constructor:** deve ser realizado o deploy desse contrato para emitir um título do Tesouro Nacional tokenizado. Ao efetuar o deploy, é necessário que você passe no constructor algumas variáveis relevantes como o nome do título, símbolo, quantia máxima de tokens a serem emitidos, preço inicial unitário, rentabilidade do ativo, data de vencimento, investimento mínimo, tipo de ativo e o endereço do Real Tokenizado.

**2.3) getTokenPrice:** função responsável por calcular o preço do ativo no momento atual. Para isso, é utilizada uma implementação da ferramenta Chainlink Functions para o contrato inteligente acessar uma API que irá considerar a taxa Selic diária desde o deploy do ativo e calcular o preço do token no momento em questão. Essa aplicação permite que calculemos o preço do ativo considerando as variações da Taxa Selic ao invés de desenvolver uma solução simplista com um valor arbitrário pré-fixado.

**2.3) invest:** função a qual o banco/instituição financeira deve chamar para que seja efetuado um investimento on-chain nesse título por parte de algum dos seus clientes. A função irá receber o valor do aporte do indivíduo, verificar se é superior ao investimento mínimo, receber o Real Tokenizado da carteira do usuário referente ao investimento, enviar os tokens do TPFt com base no preço do ativo no momento e listar o investidor na lista de investidores daquele ativo. Caso o investidor já esteja listado, ele não será adicionado novamente.

**2.4) withdrawInvestor:** função utilizada para a instituição financeira realizar a liquidação dos títulos de um investidor. Nessa função, é realizado o mecanismo contrário da função invest: o contrato inteligente recebe o número de tokens TPFt da carteira do usuário e paga o investidor com o Real Tokenizado com base no preço do ativo no momento.

**2.5) withdrawBacen:** função utilizada para o Banco Central receber os tokens de Real Tokenizado de todos os investimentos efetuados naquele título

 ### 3) Credpix

 O Credpix é a implementação em contratos inteligentes do nosso mecanismo de crédito colateralizado com o Real Tokenizado. Para efetuar uma operação de crédito, a instituição financeira deve chamar a função creditOperation, a qual recebe o TPFt do devedor, que fica armazenado no contrato, e efetua a transação em Real Tokenizado da instituição financeira que está efetuando essa operação. Além disso, essa operação é salva para que haja o controle do pagamento da dívida.
