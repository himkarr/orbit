import AuthForm from "../components/AuthForm";
export default function Login(props) {
  return (
    <AuthForm
      {...props}
      title="Welcome back"
      text="Enter your details to sign in to Orbit."
      submit="Sign in"
    />
  );
}
