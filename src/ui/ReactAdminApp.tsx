import { Admin, Resource, ListGuesser } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';

const ReactAdminApp = () => {
    const dataProvider = simpleRestProvider('http://localhost:3000/api');

    return (
        <Admin dataProvider={dataProvider}>
            {/*<Resource name="importcvs" list={ListGuesser} />*/}
            <Resource name="inventories" list={ListGuesser} />
            <Resource name="orders" list={ListGuesser} />
            <Resource name="products" list={ListGuesser} />
        </Admin>
    );
};

export { ReactAdminApp };
export default ReactAdminApp;
