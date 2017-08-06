import * as React from 'react';
import { submitForm } from '../dom-util';

interface LoginDialogProps {
    onLogin: (leagues: LeagueInfo[]) => void;
}

interface LoginDialogState {
    disabled: boolean;
    failed: boolean;
}

export default class LoginDialog extends React.Component<LoginDialogProps, LoginDialogState> {

    constructor(props: LoginDialogProps) {
        super(props);
        this.state = {
            disabled: false,
            failed: false,
        };
    }

    render() {
        const { disabled, failed } = this.state;
        const className = failed ? 'dialog opening failed' : 'dialog opening';
        return (
            <section className={className}>
                <h2>User Login</h2>
                <form id="login-form" action="/login" method="post" onSubmit={event => this.onSubmit(event)}>
                    <input type="text" name="email" id="email" placeholder="Email Address"/>
                    <input type="password" name="password" id="password" placeholder="Password"/>
                    <button className="sign-in" disabled={disabled}>Sign In</button>
                </form>
            </section>
        );
    }

    private onSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();
        this.setState({ disabled: true, failed: false });

        submitForm(event.currentTarget, event => {
            const request = event.target as XMLHttpRequest
            if (request.status === 200) {
                this.props.onLogin(request.response as LeagueInfo[]);
            } else {
                this.setState({ disabled: false, failed: true });
            };
        });
    }
}
