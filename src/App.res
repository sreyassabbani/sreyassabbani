// This type is based on the getInitialProps return value.
// If you are using getServerSideProps or getStaticProps, you probably
// will never need this
// See https://nextjs.org/docs/advanced-features/custom-app
type pageProps

module PageComponent = {
  type t = React.component<pageProps>
}

let nodeEnv = %raw(`typeof process !== "undefined" && process.env && process.env.NODE_ENV ? process.env.NODE_ENV : "development"`)

let url = switch nodeEnv {
| "production" => "https://sreyassabbani.github.io/sreyassabbani"
| _ => "http://localhost:3000"
}

type props = {
  @as("Component")
  component: PageComponent.t,
  pageProps: pageProps,
}

// We are not using `@react.component` since we will never
// use <App/> within our ReScript code.
// It's only used within `pages/_app.js`
let default = (props: props): React.element => {
  let {component, pageProps} = props

  let router = Next.Router.useRouter()

  let content = React.createElement(component, pageProps)

  switch router["route"] {
  | "/examples" =>
    <MainLayout>
      <h1 className="font-bold"> {React.string("Examples Section")} </h1>
      <div> content </div>
    </MainLayout>
  | "/404" => content
  | _ => <MainLayout> content </MainLayout>
  }
}
