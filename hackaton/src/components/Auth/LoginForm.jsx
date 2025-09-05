// ...existing imports...

export default function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (values) => {
    try {
      const data = await login(values);
      
      dispatch(setCredentials({
        token: data.token,
        user: data.user
      }));

      // Redirect based on role
      if (data.user.role === 'HOST') {
        navigate('/host/dashboard');
      } else {
        navigate('/profile');
      }
    } catch (error) {
      // ...error handling...
    }
  };

  // ...existing render code...
}
