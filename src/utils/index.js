import axios from 'axios';

export const getCurrentCity = () => {
    const localCity = JSON.parse(localStorage.getItem('hkzf_city'));

    if (!localCity) {
        return new Promise((resolve, reject) => {
            // 本地无
            const myCity = new window.BMap.LocalCity();
            myCity.get(async res => {
                try {
                    const {
                        data
                    } = await axios.get(`http://localhost:8080/area/info?name=${res.name}`);
                    // 则获取数据并存储到本地
                    localStorage.setItem('hkzf_city', JSON.stringify(data.body));

                    resolve(data.body);
                } catch (e) {
                    // 获取当前定位城市失败
                    reject(e);
                }
            });
        })
    }

    return Promise.resolve(localCity);
};