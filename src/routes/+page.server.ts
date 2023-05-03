import { getDiv1Players } from '$lib/server/tmio';
import { countCountries } from '$lib/countCountries';
import { averageRank } from '$lib/averageRank';

export async function load({ fetch }) {
    const div1 = await getDiv1Players(fetch);
    const countryCount = countCountries(div1);
    const averageRankData = averageRank(div1);
    
    const info = `${Object.keys(Object.fromEntries(div1)).length} players`;

    return {
        title: "Country Stats",
        info,
        countryCount,
        averageRankData,
        div1,
    };
};