import AuthForm from "../components/AuthForm";
export default function Register(props) {
  return (
    <AuthForm
      {...props}
      register
      title="Create your account"
      text="Start turning ideas into working websites."
      submit="Create account"
    />
  );
}
