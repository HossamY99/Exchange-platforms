package exchange.api.model;
import com.google.gson.annotations.SerializedName;
public class Transaction {
    public Float getUsdAmount() {
        return usdAmount;
    }

    public Float getLbpAmount() {
        return lbpAmount;
    }

    public Boolean getUsdToLbp() {
        return usdToLbp;
    }

    public Integer getId() {
        return id;
    }

    public String getAddedDate() {
        return addedDate;
    }

    @SerializedName("usd_amount")
    Float usdAmount;
    @SerializedName("lbp_amount")
    Float lbpAmount;

    public void setUsdAmount(Float usdAmount) {
        this.usdAmount = usdAmount;
    }

    public void setLbpAmount(Float lbpAmount) {
        this.lbpAmount = lbpAmount;
    }

    public void setUsdToLbp(Boolean usdToLbp) {
        this.usdToLbp = usdToLbp;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public void setAddedDate(String addedDate) {
        this.addedDate = addedDate;
    }

    @SerializedName("usd_to_lbp")
    Boolean usdToLbp;
    @SerializedName("id")
    Integer id;
    @SerializedName("added_date")
    String addedDate;

    public Transaction(Float usdAmount, Float lbpAmount, Boolean usdToLbp)
    {
        this.usdAmount = usdAmount;
        this.lbpAmount = lbpAmount;
        this.usdToLbp = usdToLbp;
    }
}
