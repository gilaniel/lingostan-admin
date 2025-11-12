import { useForm, Controller } from "react-hook-form";
import { Form } from "@heroui/form";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { apiClient } from "@/services/https";
import { useAuthStore } from "@/store/useAuthStore";

type Auth = {
  email: string;
  password: string;
};

const Auth = () => {
  const { setAccessToken, fetchProfile } = useAuthStore();
  const { control, handleSubmit } = useForm<Auth>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: Auth) => {
    const { data: tokens } = await apiClient.post<{ access_token: string }>(
      "/auth/login",
      data
    );

    setAccessToken(tokens.access_token);

    fetchProfile();
  };

  return (
    <div className="container max-w-[400px] mx-auto">
      <Form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Controller
          control={control}
          name="email"
          render={({
            field: { onChange, value },
            fieldState: { error, invalid },
          }) => (
            <Input
              isRequired
              errorMessage={error?.message}
              isInvalid={invalid}
              label="Email"
              labelPlacement="outside-top"
              validationBehavior="aria"
              value={value}
              onChange={onChange}
            />
          )}
          rules={{ required: true }}
        />

        <Controller
          control={control}
          name="password"
          render={({
            field: { onChange, value },
            fieldState: { error, invalid },
          }) => (
            <Input
              isRequired
              type="password"
              errorMessage={error?.message}
              isInvalid={invalid}
              label="Password"
              labelPlacement="outside-top"
              validationBehavior="aria"
              value={value}
              onChange={onChange}
            />
          )}
          rules={{ required: true }}
        />
        <Button type="submit" className="w-full">
          Sign in
        </Button>
      </Form>
    </div>
  );
};

export default Auth;
