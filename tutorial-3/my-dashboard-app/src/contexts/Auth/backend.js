import bearFactory, {
    FixedLoginAndPasswordAuthProvider,
    AnonymousAuthProvider,
} from "@gooddata/sdk-backend-bear";
import { backend } from "../../constants";

export const createBackend = () => {
    return bearFactory({ hostname: backend }).withAuthentication(new AnonymousAuthProvider());
};

export const backendWithCredentials = (backend, username, password) => {
    return backend.withAuthentication(new FixedLoginAndPasswordAuthProvider(username, password));
};
