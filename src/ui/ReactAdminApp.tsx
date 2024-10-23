import { Admin, Resource, ListGuesser } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';

const ReactAdminApp = () => {
    const dataProvider = simpleRestProvider('http://localhost:5000/api');

    return (
        <Admin dataProvider={dataProvider}>
            <Resource name="posts" list={ListGuesser} />
        </Admin>
    );
};

export { ReactAdminApp };
export default ReactAdminApp;
