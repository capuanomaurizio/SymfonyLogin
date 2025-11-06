import {Steps} from "antd";

const StepsNavigator = ({page, setPage, component}) => {
    return(
        <Steps
            type="navigation"
            style={{ backgroundColor: 'white', borderRadius: 10, marginBottom: '1rem' }}
            current={page}
            onChange={(value) => setPage(value)}
            items={[
                {
                    status: 'process',
                    title: 'Informazioni processo',
                },
                {
                    status: 'process',
                    title: 'Componenti processo',
                },
                {
                    status: 'process',
                    title: 'Triplette di funzioni',
                    description: component?.name || '',
                },
                {
                    status: 'process',
                    title: 'Matrice dei componenti',
                    description: component?.name || '',
                },
            ]}
        />
    )
}

export default StepsNavigator;
