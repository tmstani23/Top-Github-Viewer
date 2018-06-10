
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
        <p className = "loading-p">
            {this.state.text}
        </p>
        )
    }
}

//Navbar component that displays the languages and buttons
function Nav(props) {
    const languages = ["All", "Javascript", "Ruby", "Python"];

    return (
        <nav className="navbar">
            <ul>
                { languages.map((lang) => (
                    <button key= { lang } onClick= { () => props.onSelectLanguage(lang) }>
                        { lang }
                    </button>    
                )) }
            </ul>
        </nav>
    )
}
//Grid component that displays all the repositories and the names and star count
function RepoGrid(props) {
    return (
        <ul className="repo-grid">
            {/* The data from the api is mapped into the repos array */}
            {props.repos.map(( { name, owner, stargazers_count, html_url } ) => (
                <li key = { name } >
                    <ul>
                        {/* Here each piece of the data is mapped to a list element and displayed */}
                        <li><a href={ html_url }> {name} </a></li>
                        <li>@{ owner.login }</li>
                        <li id="stargazers-li">{ stargazers_count }</li>
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
            activeLanguage: "All",
            loading: true
        };
        //Bind App methods within the constructor:
        this.handleSelectLanguage = this.handleSelectLanguage.bind(this);
        this.fetchRepos = this.fetchRepos.bind(this);
    }
    //This method sets the loading state and collects the data from the api
    fetchRepos(lang) {
        this.setState( {
            loading: true,
        } )
        //Here the data is fetched from the api and the loading state and repos array are updated:
        window.API.fetchPopularRepos(lang)
            .then((repos) => {
                this.setState( {
                    loading: false,
                    repos,
                } )
            } )
    }
    //Call fetch the repos for each language once the component mounts
    componentDidMount() {
        this.fetchRepos(this.state.activeLanguage);
    }
    //Update the component with the current active language if it is different than the previous one
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
    //Render the Nav, Loading and RepoGrid components:
    render() {
        return (
        <div>
            <Nav onSelectLanguage = { this.handleSelectLanguage }/>
            {/* If loading is true display loading component */}
            { this.state.loading === true 
                ? <Loading />
                // Else display a header with the current language and the RepoGrid component
                : <div>
                    <h1 id = "lang-header">
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