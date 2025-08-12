"use client";

import { Amplify } from "aws-amplify";
import React, { useEffect } from "react";

import {
  Authenticator,
  Heading,
  Radio,
  RadioGroupField,
  useAuthenticator,
  View
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { usePathname, useRouter } from "next/navigation";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID!
    }
  }
});

const components = {
  Header() {
    return (
      <View className="mt-4 mb-7">
        <Heading level={3} className="text-2xl! font-bold!">
          RENT
          <span className="text-secondary-500 font-light">URA</span>
        </Heading>
        <p className="text-muted-foreground mt-2">
          <span className="font-bold">Welcome!</span> Please sign in to continue
        </p>
      </View>
    );
  },
  SignIn: {
    Footer() {
      const { toSignUp } = useAuthenticator();
      return (
        <View className="text-center mt-4">
          <p className="text-muted-foreground">
            Don&apos;t have an account?{" "}
            <button
              onClick={toSignUp}
              className="text-red-500 hover:underline bg-transparent border-none p-0">
              Sign Up
            </button>
          </p>
        </View>
      );
    }
  },
  SignUp: {
    FormFields() {
      const { validationErrors } = useAuthenticator();
      return (
        <>
          <Authenticator.SignUp.FormFields />
          <RadioGroupField
            legend="Role"
            name="custom:Role"
            errorMessage={validationErrors?.["custom:Role"]}
            hasError={!!validationErrors?.["custom:Role"]}
            isRequired>
            <Radio value="tenant">Tenant</Radio>
            <Radio value="manager">Manager</Radio>
          </RadioGroupField>
        </>
      );
    },
    Footer() {
      const { toSignIn } = useAuthenticator();
      return (
        <View className="text-center mt-4">
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <button
              onClick={toSignIn}
              className="text-red-500 hover:underline bg-transparent border-none p-0">
              Sign In
            </button>
          </p>
        </View>
      );
    }
  }
};

const formFields = {
  signIn: {
    username: {
      placeholder: "Demo email: smitbhamwala@gmail.com",
      label: "Email",
      isRequired: true
    },
    password: {
      placeholder: "Demo password: Password@1",
      label: "Password",
      isRequired: true
    }
  },
  signUp: {
    username: {
      order: 1,
      placeholder: "Choose a username",
      label: "Username",
      isRequired: true
    },
    email: {
      order: 2,
      placeholder: "Enter your Email",
      label: "Email",
      isRequired: true
    },
    password: {
      order: 3,
      placeholder: "Create a Password",
      label: "Password",
      isRequired: true
    },
    confirm_password: {
      order: 4,
      placeholder: "Confirm your Password",
      label: "Confirm Password",
      isRequired: true
    }
  }
};

export default function Auth({ children }: { children: React.ReactNode }) {
  const { user } = useAuthenticator((context) => [context.user]);
  const router = useRouter();
  const pathname = usePathname();

  const isAuthPage = pathname.match(/^\/(signin|signup)$/);
  const isDashboardPage =
    pathname.startsWith("/manager") || pathname.startsWith("/tenants");

  useEffect(() => {
    if (user && isAuthPage) {
      // if (user.attributes["custom:role"] === "manager") {
      //   router.push("/manager/dashboard");
      // } else if (user.attributes["custom:role"] === "tenant") {
      //   router.push("/tenants/dashboard");
      // }
      router.push("/");
    }
  }, [user, isAuthPage, router]);

  if (!isAuthPage && !isDashboardPage) {
    return <>{children}</>;
  }

  return (
    <div className="h-full">
      <Authenticator
        initialState={pathname.startsWith("/signup") ? "signUp" : "signIn"}
        components={components}
        formFields={formFields}>
        {() => <>{children}</>}
      </Authenticator>
    </div>
  );
}
