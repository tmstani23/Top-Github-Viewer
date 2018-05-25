
//Component to handle loading states when fetching data:
class Loading extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        text: 'Loading'
        };
    }
    componentDidMount() {
        const stopper = this.state.text + '...';
        this.interval = window.setInterval(() => {
        this.state.text === stopper
            ? this.setState(() => ({ text: 'Loading' }))
            : this.setState((prevState) => ({ text: prevState.text + '.' }))
        }, 300)
    }
    componentWillUnmount() {
        window.clearInterval(this.interval);
    }
    render() {
        return (
        <p>
            {this.state.text}
        </p>
        )
    }
}


function Nav(props) {
    const languages = ["all", "javascript", "ruby", "python"];

    return (
        <nav>
            <ul>
                { languages.map((lang) => (
                    <li key= { lang } onClick= { () => props.onSelectLanguage(lang) }>
                        { lang }
                    </li>    
                )) }
            </ul>
        </nav>
    )
}

function RepoGrid(props) {
    return (
        <ul style = { { display: 'flex', flexWrap: 'wrap' } }>
            {props.repos.map(( { name, owner, stargazers_count, html_url } ) => (
                <li key = { name } style = {{margin: 30}}>
                    <ul>
                        <li><a href={ html_url }> {name} </a></li>
                        <li>@{ owner.login }</li>
                        <li>{ stargazers_count }</li>
                    </ul>
                </li>
            ))}
        </ul>
    )
}

//Main app responsible for holding and displaying data and ui:
class App extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            repos: [],
            activeLanguage: "all",
            loading: true
        };
        //Bind App methods within the constructor:
        this.handleSelectLanguage = this.handleSelectLanguage.bind(this);
        this.fetchRepos = this.fetchRepos.bind(this);
    }

    fetchRepos(lang) {
        this.setState( {
            loading: true,
        } )

        window.API.fetchPopularRepos(lang)
            .then((repos) => {
                this.setState( {
                    loading: false,
                    repos,
                } )
            } )
    }

    componentDidMount() {
        this.fetchRepos(this.state.activeLanguage);
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState.activeLanguage !== this.state.activeLanguage) {
            this.fetchRepos(this.state.activeLanguage);
        }
    }
    //This method updates the state of the App and adjusts the active language property:
    handleSelectLanguage(lang) {
        this.setState( {
            activeLanguage: lang
        } ) 
    }
    render() {
        return (
        <div>
            <Nav onSelectLanguage = { this.handleSelectLanguage }/>
            { this.state.loading === true 
                ? <Loading />
                : <div>
                    <h1 style = { {textAlign: "center"} }>
                    { this.state.activeLanguage }
                    </h1>
                    <RepoGrid repos = { this.state.repos }/>
                </div>
            }
        </div>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('app')
)